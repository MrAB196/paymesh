
from sqlalchemy import String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int]
    receiver_id: Mapped[int]
    amount: Mapped[int] = mapped_column(BigInteger)
    status: Mapped[str] = mapped_column(
        String(30),
        default="PENDING"
    )
    idempotency_key: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True
    )
