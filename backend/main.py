from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, transactions, categories

app = FastAPI(title="金鑫記帳 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["認證"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["收支"])
app.include_router(categories.router, prefix="/api/categories", tags=["分類"])

@app.get("/")
def root():
    return {"message": "金鑫記帳 API 運作中"}

@app.get("/health")
def health():
    return {"status": "ok"}
