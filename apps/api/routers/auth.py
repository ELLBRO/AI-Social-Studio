from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from apps.api.core.exceptions import AppException, UnauthorizedError, ConflictError
from apps.api.core.dependencies import get_current_user
from apps.api.models.user import User, Organization, Membership, RoleEnum
from apps.api.domains.credits.service import CreditService
from apps.api.domains.billing.service import BillingService
from apps.api.schemas.auth import UserRegister, UserLogin, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise ConflictError("An account with this email already exists")

    # Create user
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create default organization & owner membership
    org_name = payload.organization_name or f"{payload.full_name.split()[0]}'s Studio"
    slug = org_name.lower().replace(" ", "-").replace("'", "") + f"-{user.id[:6]}"
    org = Organization(name=org_name, slug=slug)
    db.add(org)
    db.commit()
    db.refresh(org)

    membership = Membership(user_id=user.id, organization_id=org.id, role=RoleEnum.OWNER)
    db.add(membership)
    db.commit()

    # Initialize subscription & trial credits
    BillingService.get_or_create_subscription(db, org.id)
    CreditService.get_or_create_account(db, org.id)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=3600,
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise UnauthorizedError("Invalid email or password")

    if not user.is_active:
        raise UnauthorizedError("User account is disabled")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=3600,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/refresh", response_model=Token)
def refresh_token(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid refresh token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise UnauthorizedError("User account not found or inactive")

    new_access = create_access_token(user.id)
    new_refresh = create_refresh_token(user.id)
    return Token(access_token=new_access, refresh_token=new_refresh, expires_in=3600)
