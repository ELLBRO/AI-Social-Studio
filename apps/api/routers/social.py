import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_user, get_current_org
from apps.api.core.exceptions import NotFoundError
from apps.api.models.user import User, Organization
from apps.api.models.social import SocialAccount, SocialCredential, SocialPlatformEnum, AccountStatus
from apps.api.domains.social.factory import get_social_adapter
from apps.api.core.security import encrypt_secret
from apps.api.schemas.social import SocialAccountResponse, ConnectAccountRequest

router = APIRouter(prefix="/social", tags=["Social Media Integrations"])


@router.get("/accounts", response_model=List[SocialAccountResponse])
def get_connected_accounts(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return (
        db.query(SocialAccount)
        .filter(SocialAccount.organization_id == org.id)
        .order_by(SocialAccount.created_at.desc())
        .all()
    )


@router.get("/oauth/{platform}/url")
def get_oauth_url(platform: SocialPlatformEnum, org: Organization = Depends(get_current_org)):
    adapter = get_social_adapter(platform)
    state = f"{org.id}:{uuid.uuid4().hex}"
    return {"oauth_url": adapter.get_oauth_authorization_url(state)}


@router.post("/connect", response_model=SocialAccountResponse, status_code=status.HTTP_201_CREATED)
async def connect_account(
    req: ConnectAccountRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    adapter = get_social_adapter(req.platform)
    code = req.auth_code or "mock_auth_code"
    token_data = await adapter.exchange_auth_code(code)

    # Check if this platform account is already registered
    existing = (
        db.query(SocialAccount)
        .filter(
            SocialAccount.organization_id == org.id,
            SocialAccount.platform == req.platform,
            SocialAccount.platform_user_id == token_data["platform_user_id"],
        )
        .first()
    )

    if existing:
        account = existing
        account.status = AccountStatus.CONNECTED
        account.account_name = req.account_name or token_data.get("account_name", account.account_name)
        account.account_handle = req.account_handle or token_data.get("account_handle", account.account_handle)
    else:
        account = SocialAccount(
            organization_id=org.id,
            platform=req.platform,
            platform_user_id=token_data["platform_user_id"],
            account_name=req.account_name or token_data.get("account_name", f"{req.platform.value.capitalize()} Profile"),
            account_handle=req.account_handle or token_data.get("account_handle", f"@{req.platform.value}_account"),
            profile_picture_url=token_data.get("profile_picture_url"),
            status=AccountStatus.CONNECTED,
        )
        db.add(account)
        db.commit()
        db.refresh(account)

    # Store encrypted credentials
    encrypted_access = encrypt_secret(token_data.get("access_token", ""))
    encrypted_refresh = encrypt_secret(token_data.get("refresh_token", ""))

    if account.credentials:
        account.credentials.encrypted_access_token = encrypted_access
        account.credentials.encrypted_refresh_token = encrypted_refresh
    else:
        cred = SocialCredential(
            account_id=account.id,
            encrypted_access_token=encrypted_access,
            encrypted_refresh_token=encrypted_refresh,
        )
        db.add(cred)

    db.commit()
    db.refresh(account)
    return account


@router.delete("/accounts/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def disconnect_account(
    account_id: str,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    account = (
        db.query(SocialAccount)
        .filter(SocialAccount.id == account_id, SocialAccount.organization_id == org.id)
        .first()
    )
    if not account:
        raise NotFoundError("Social account not found")

    db.delete(account)
    db.commit()
    return None
