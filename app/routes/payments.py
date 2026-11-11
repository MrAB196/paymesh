
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services.payment_service import process_payment

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/", response_model=PaymentResponse)
def create_payment(
    data: PaymentCreate,
    idempotency_key: str = Header(alias="Idempotency-Key"),
    db: Session = Depends(get_db)
):
    return process_payment(
        db=db,
        sender_id=data.sender_id,
        receiver_id=data.receiver_id,
        amount=data.amount,
        idempotency_key=idempotency_key
    )


@router.get("/", response_model=list[PaymentResponse])
def get_payments(db: Session = Depends(get_db)):
    return db.query(Payment).order_by(Payment.id.desc()).all()
