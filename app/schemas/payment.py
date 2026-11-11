
from pydantic import BaseModel, Field


class AccountCreate(BaseModel):
    owner_name: str = Field(min_length=2, max_length=100)
    initial_balance: int = Field(default=0, ge=0)


class AccountResponse(BaseModel):
    id: int
    owner_name: str
    balance: int

    model_config = {"from_attributes": True}


class PaymentCreate(BaseModel):
    sender_id: int
    receiver_id: int
    amount: int = Field(gt=0)


class PaymentResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    amount: int
    status: str

    model_config = {"from_attributes": True}
