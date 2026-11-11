
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.account import Account
from app.models.payment import Payment
from app.models.ledger import LedgerEntry


def process_payment(
    db: Session,
    sender_id: int,
    receiver_id: int,
    amount: int,
    idempotency_key: str
):
    if sender_id == receiver_id:
        raise HTTPException(400, "Cannot pay yourself")

    if not idempotency_key or len(idempotency_key) > 100:
        raise HTTPException(400, "Invalid idempotency key")

    try:
        with db.begin():

            existing = db.scalar(
                select(Payment).where(
                    Payment.idempotency_key == idempotency_key
                )
            )

            if existing:
                if (
                    existing.sender_id != sender_id
                    or existing.receiver_id != receiver_id
                    or existing.amount != amount
                ):
                    raise HTTPException(
                        409, "Idempotency key reused with different data"
                    )

                payment_id = existing.id

            else:
                accounts = db.scalars(
                    select(Account)
                    .where(Account.id.in_([sender_id, receiver_id]))
                    .order_by(Account.id)
                    .with_for_update()
                ).all()

                account_map = {a.id: a for a in accounts}
                sender = account_map.get(sender_id)
                receiver = account_map.get(receiver_id)

                if not sender or not receiver:
                    raise HTTPException(404, "Account not found")

                if sender.balance < amount:
                    raise HTTPException(400, "Insufficient balance")

                sender.balance -= amount
                receiver.balance += amount

                payment = Payment(
                    sender_id=sender_id,
                    receiver_id=receiver_id,
                    amount=amount,
                    status="SUCCESS",
                    idempotency_key=idempotency_key
                )

                db.add(payment)
                db.flush()

                db.add_all([
                    LedgerEntry(
                        payment_id=payment.id,
                        account_id=sender_id,
                        entry_type="DEBIT",
                        amount=amount
                    ),
                    LedgerEntry(
                        payment_id=payment.id,
                        account_id=receiver_id,
                        entry_type="CREDIT",
                        amount=amount
                    )
                ])

                payment_id = payment.id

        return db.get(Payment, payment_id)

    except IntegrityError:
        db.rollback()

        existing = db.scalar(
            select(Payment).where(
                Payment.idempotency_key == idempotency_key
            )
        )

        if existing:
            if (
                existing.sender_id != sender_id
                or existing.receiver_id != receiver_id
                or existing.amount != amount
            ):
                raise HTTPException(
                    409, "Idempotency key reused with different data"
                )
            return existing

        raise HTTPException(409, "Payment conflict; retry safely")
