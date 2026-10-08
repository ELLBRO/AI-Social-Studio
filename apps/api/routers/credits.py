from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_org
from apps.api.models.user import Organization
from apps.api.models.billing import CreditTransaction
from apps.api.domains.credits.service import CreditService
from apps.api.schemas.billing import CreditAccountResponse, CreditTransactionResponse

router = APIRouter(prefix="/credits", tags=["Credits Ledger"])


@router.get("/account", response_model=CreditAccountResponse)
def get_credit_account(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return CreditService.get_or_create_account(db, org.id)


@router.get("/transactions", response_model=List[CreditTransactionResponse])
def get_credit_transactions(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    account = CreditService.get_or_create_account(db, org.id)
    return (
        db.query(CreditTransaction)
        .filter(CreditTransaction.credit_account_id == account.id)
        .order_by(CreditTransaction.created_at.desc())
        .limit(100)
        .all()
    )
