from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import Budget, Transaction, User
from schemas import BudgetCreate, BudgetResponse, BudgetWithAlert
from auth import get_current_user

router = APIRouter()

@router.post("/", response_model=BudgetResponse)
def create_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 檢查是否已存在相同預算
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == budget.month,
        Budget.year == budget.year,
        (Budget.category_id == budget.category_id) | ((Budget.category_id == None) & (budget.category_id == None))
    ).first()
    
    if existing:
        # 更新現有預算
        existing.amount = budget.amount
        db.commit()
        db.refresh(existing)
        return existing
    
    new_budget = Budget(
        amount=budget.amount,
        category_id=budget.category_id,
        month=budget.month,
        year=budget.year,
        user_id=current_user.id
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget

@router.get("/", response_model=List[BudgetResponse])
def get_budgets(
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Budget).filter(Budget.user_id == current_user.id)
    if month:
        query = query.filter(Budget.month == month)
    if year:
        query = query.filter(Budget.year == year)
    return query.all()

@router.get("/alerts", response_model=List[BudgetWithAlert])
def get_budget_alerts(
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy import func
    
    if not year:
        year = datetime.utcnow().year
    if not month:
        month = datetime.utcnow().month
    
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == month,
        Budget.year == year
    ).all()
    
    result = []
    for budget in budgets:
        # 計算已花費
        query = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.date >= start_date,
            Transaction.date < end_date
        )
        
        if budget.category_id:
            query = query.filter(Transaction.category_id == budget.category_id)
        
        spent = query.scalar() or 0
        remaining = budget.amount - spent
        percent = (spent / budget.amount * 100) if budget.amount > 0 else 0
        is_over = spent > budget.amount
        
        result.append(BudgetWithAlert(
            budget=BudgetResponse(
                id=budget.id,
                amount=budget.amount,
                category_id=budget.category_id,
                month=budget.month,
                year=budget.year,
                category=budget.category
            ),
            spent=spent,
            remaining=remaining,
            percent=percent,
            is_over=is_over
        ))
    
    return result

@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    if not budget:
        raise HTTPException(status_code=404, detail="預算不存在")
    
    db.delete(budget)
    db.commit()
    return {"message": "刪除成功"}
