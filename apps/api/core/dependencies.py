from typing import Callable, List, Optional
from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.security import decode_token
from apps.api.core.exceptions import (
    UnauthorizedError,
    ForbiddenError,
    InsufficientCreditsError,
    NotFoundError,
)
from apps.api.models.user import User, Organization, Membership, RoleEnum
from apps.api.models.billing import CreditAccount, CreditTransaction, CreditTransactionType

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not token:
        raise UnauthorizedError("Missing authentication token")

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedError("Invalid or expired authentication token")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError("Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise UnauthorizedError("User account not found or inactive")

    return user


def get_current_org(
    x_org_id: Optional[str] = Header(None, alias="X-Organization-Id"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Organization:
    """Multi-tenant isolation: validates user belongs to the requested organization."""
    if x_org_id:
        membership = (
            db.query(Membership)
            .filter(
                Membership.user_id == current_user.id,
                Membership.organization_id == x_org_id,
            )
            .first()
        )
        if not membership:
            raise ForbiddenError("Access to this organization is denied")
        org = db.query(Organization).filter(Organization.id == x_org_id).first()
        if not org:
            raise NotFoundError("Organization not found")
        return org

    # If no header provided, find user's default organization
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == current_user.id)
        .first()
    )
    if not membership:
        raise ForbiddenError("User is not associated with any organization")

    org = db.query(Organization).filter(Organization.id == membership.organization_id).first()
    if not org:
        raise NotFoundError("Organization not found")
    return org


def require_role(allowed_roles: List[RoleEnum]) -> Callable:
    def role_checker(
        current_user: User = Depends(get_current_user),
        org: Organization = Depends(get_current_org),
        db: Session = Depends(get_db),
    ) -> Membership:
        membership = (
            db.query(Membership)
            .filter(
                Membership.user_id == current_user.id,
                Membership.organization_id == org.id,
            )
            .first()
        )
        if not membership or membership.role not in allowed_roles:
            raise ForbiddenError(f"Operation requires one of roles: {[r.value for r in allowed_roles]}")
        return membership

    return role_checker


def deduct_credits(
    db: Session,
    organization_id: str,
    amount: int,
    description: str,
    reference_type: Optional[str] = None,
    reference_id: Optional[str] = None,
) -> CreditAccount:
    """Ledger-based atomic credit deduction with balance verification."""
    account = (
        db.query(CreditAccount)
        .filter(CreditAccount.organization_id == organization_id)
        .with_for_update()
        .first()
    )
    if not account:
        raise NotFoundError("Credit account not found")

    if account.balance < amount:
        raise InsufficientCreditsError(
            f"Insufficient credits. Required: {amount}, Available: {account.balance}"
        )

    account.balance -= amount
    account.lifetime_used += amount

    transaction = CreditTransaction(
        credit_account_id=account.id,
        amount=-amount,
        type=CreditTransactionType.CONSUMPTION,
        description=description,
        reference_type=reference_type,
        reference_id=reference_id,
    )
    db.add(transaction)
    db.commit()
    db.refresh(account)
    return account
