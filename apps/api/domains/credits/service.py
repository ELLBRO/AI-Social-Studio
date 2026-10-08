from typing import Optional
from sqlalchemy.orm import Session
from apps.api.models.billing import CreditAccount, CreditTransaction, CreditTransactionType
from apps.api.core.exceptions import InsufficientCreditsError, NotFoundError


class CreditService:
    @staticmethod
    def get_or_create_account(db: Session, organization_id: str) -> CreditAccount:
        account = db.query(CreditAccount).filter(CreditAccount.organization_id == organization_id).first()
        if not account:
            account = CreditAccount(
                organization_id=organization_id,
                balance=150,  # 150 welcome trial credits
                lifetime_granted=150,
                lifetime_used=0,
            )
            db.add(account)
            db.commit()
            db.refresh(account)

            # Record initial grant in ledger
            tx = CreditTransaction(
                credit_account_id=account.id,
                amount=150,
                type=CreditTransactionType.GRANT,
                description="Welcome Trial Credits Grant",
                reference_type="signup_bonus",
            )
            db.add(tx)
            db.commit()

        return account

    @staticmethod
    def deduct_credits(
        db: Session,
        organization_id: str,
        amount: int,
        description: str,
        reference_type: Optional[str] = None,
        reference_id: Optional[str] = None,
    ) -> CreditAccount:
        account = (
            db.query(CreditAccount)
            .filter(CreditAccount.organization_id == organization_id)
            .with_for_update()
            .first()
        )
        if not account:
            account = CreditService.get_or_create_account(db, organization_id)

        if account.balance < amount:
            raise InsufficientCreditsError(
                f"Operation requires {amount} credits, but balance is {account.balance}."
            )

        account.balance -= amount
        account.lifetime_used += amount

        tx = CreditTransaction(
            credit_account_id=account.id,
            amount=-amount,
            type=CreditTransactionType.CONSUMPTION,
            description=description,
            reference_type=reference_type,
            reference_id=reference_id,
        )
        db.add(tx)
        db.commit()
        db.refresh(account)
        return account

    @staticmethod
    def grant_credits(
        db: Session,
        organization_id: str,
        amount: int,
        description: str,
        reference_type: Optional[str] = None,
        reference_id: Optional[str] = None,
    ) -> CreditAccount:
        account = CreditService.get_or_create_account(db, organization_id)
        account.balance += amount
        account.lifetime_granted += amount

        tx = CreditTransaction(
            credit_account_id=account.id,
            amount=amount,
            type=CreditTransactionType.GRANT,
            description=description,
            reference_type=reference_type,
            reference_id=reference_id,
        )
        db.add(tx)
        db.commit()
        db.refresh(account)
        return account
