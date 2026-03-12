from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from database import get_db
from models import RecurringTransaction, Transaction, User
from schemas import RecurringCreate, RecurringResponse
from auth import get_current_user

router = APIRouter()

def calculate_next_date(current_date: datetime, frequency: str) -> datetime:
    if frequency == "daily":
        return current_date + timedelta(days=1)
    elif frequency == "weekly":
        return current_date + timedelta(weeks=1)
    elif frequency == "monthly":
        if current_date.month == 12:
            return datetime(current_date.year + 1, 1, current_date.day)
        else:
            return datetime(current_date.year, current_date.month + 1, current_date.day)
    elif frequency == "yearly":
        return datetime(current_date.year + 1, current_date.month, current_date.day)
    return current_date

@router.post("/", response_model=RecurringResponse)
def create_recurring(
    recurring: RecurringCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_recurring = RecurringTransaction(
        amount=recurring.amount,
        description=recurring.description,
        type=recurring.type,
        category_id=recurring.category_id,
        frequency=recurring.frequency,
        start_date=recurring.start_date,
        next_date=recurring.start_date,
        user_id=current_user.id
    )
    db.add(new_recurring)
    db.commit()
    db.refresh(new_recurring)
    return new_recurring

@router.get("/", response_model=List[RecurringResponse])
def get_recurrings(
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(RecurringTransaction).filter(RecurringTransaction.user_id == current_user.id)
    if active_only:
        query = query.filter(RecurringTransaction.is_active == True)
    return query.order_by(RecurringTransaction.next_date).all()

@router.put("/{recurring_id}/toggle")
def toggle_recurring(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    if not recurring:
        raise HTTPException(status_code=404, detail="定期交易不存在")
    
    recurring.is_active = not recurring.is_active
    db.commit()
    return {"message": "更新成功", "is_active": recurring.is_active}

@router.post("/{recurring_id}/execute")
def execute_recurring(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    if not recurring:
        raise HTTPException(status_code=404, detail="定期交易不存在")
    
    # 建立交易紀錄
    transaction = Transaction(
        amount=recurring.amount,
        description=recurring.description,
        type=recurring.type,
        category_id=recurring.category_id,
        date=datetime.utcnow(),
        recurring_id=recurring.id,
        user_id=current_user.id
    )
    db.add(transaction)
    
    # 更新下次執行日期
    recurring.next_date = calculate_next_date(recurring.next_date, recurring.frequency)
    db.commit()
    db.refresh(transaction)
    
    return {"message": "執行成功", "transaction": transaction}

@router.delete("/{recurring_id}")
def delete_recurring(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recurring = db.query(RecurringTransaction).filter(
        RecurringTransaction.id == recurring_id,
        RecurringTransaction.user_id == current_user.id
    ).first()
    if not recurring:
        raise HTTPException(status_code=404, detail="定期交易不存在")
    
    db.delete(recurring)
    db.commit()
    return {"message": "刪除成功"}
