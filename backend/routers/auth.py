from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
from schemas import UserCreate, UserResponse, Token

router = APIRouter()

DEFAULT_CATEGORIES = [
    {"name": "薪水", "type": "income", "icon": "💰"},
    {"name": "獎金", "type": "income", "icon": "🎁"},
    {"name": "投資收益", "type": "income", "icon": "📈"},
    {"name": "其他收入", "type": "income", "icon": "💵"},
    {"name": "餐飲", "type": "expense", "icon": "🍔"},
    {"name": "交通", "type": "expense", "icon": "🚗"},
    {"name": "住宿", "type": "expense", "icon": "🏠"},
    {"name": "購物", "type": "expense", "icon": "🛍️"},
    {"name": "娛樂", "type": "expense", "icon": "🎮"},
    {"name": "醫療", "type": "expense", "icon": "🏥"},
    {"name": "教育", "type": "expense", "icon": "📚"},
    {"name": "其他支出", "type": "expense", "icon": "📝"},
]

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="用戶名或Email已存在")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create default categories
    for cat in DEFAULT_CATEGORIES:
        from models import Category
        category = Category(name=cat["name"], type=cat["type"], icon=cat["icon"], user_id=new_user.id)
        db.add(category)
    db.commit()

    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用戶名或密碼錯誤",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return current_user
