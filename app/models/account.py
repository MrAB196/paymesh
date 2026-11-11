
from sqlalchemy import String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_name: Mapped[str] = mapped_column(String(100))
    balance: Mapped[int] = mapped_column(
        BigInteger,
        default=0,
        nullable=False
    )
