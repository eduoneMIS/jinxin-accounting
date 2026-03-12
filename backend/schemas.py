from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CategoryCreate(BaseModel):
    name: str
    type: str
    icon: Optional[str] = "📁"

class CategoryResponse(BaseModel):
    id: int
    name: str
    type: str
    icon: str

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    amount: float
    description: str
    date: Optional[datetime] = None
    type: str
    category_id: int

class TransactionResponse(BaseModel):
    id: int
    amount: float
    description: str
    date: datetime
    type: str
    category_id: int
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
