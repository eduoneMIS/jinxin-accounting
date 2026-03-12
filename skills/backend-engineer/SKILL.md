# Backend Engineer Skill

> 職位：後端工程師 | 技術棧：Python + FastAPI

## 核心職責

1. **根據開發書實作 API**
2. **設計與管理資料庫模型**
3. **確保系統安全性**
4. **效能優化**

## 技術選型

### 核心技術
- **語言**：Python 3.11+
- **框架**：FastAPI (高性能、非同步)
- **伺服器**：Uvicorn (ASGI 伺服器)
- **ORM**：SQLAlchemy 2.0+
- **遷移工具**：Alembic
- **驗證**：PyJWT + Passlib

### 可選技術
- **快取**：Redis (正式環境)
- **任務隊列**：Celery (背景任務)
- **API 文件**：Swagger UI (自動產生)
- **測試**：Pytest + httpx

## API 設計原則

### RESTful 規範
```
GET    /resources      # 取得列表
GET    /resources/:id  # 取得單筆
POST   /resources      # 建立資源
PUT    /resources/:id # 更新資源
DELETE /resources/:id # 刪除資源
```

### Response 格式
```json
{
  "success": true,
  "data": {},
  "message": "OK",
  "meta": {
    "page": 1,
    "total": 100
  }
}
```

### Error Handling
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "詳細錯誤訊息"
  }
}
```

## 專案結構

```
app/
├── api/
│   └── v1/
│       └── endpoints/    # API 路由
├── models/              # SQLAlchemy 模型
├── schemas/             # Pydantic schemas
├── services/            # 業務邏輯
├── core/
│   ├── config.py        # 配置管理
│   ├── security.py      # 安全性
│   └── database.py      # 資料庫連線
├── utils/               # 工具函式
└── main.py              # 入口點
```

## 安全性實作

### 認證與授權
- JWT Token 驗證
- Password bcrypt 加密
- Role-Based Access Control (RBAC)

### API 安全
- CORS 設定
- Rate Limiting
- Input Validation (Pydantic)
- SQL Injection 防護 (ORM)

## 資料庫設計

### SQLite (開發)
- 輕量、免安裝
- 適合開發與測試

### PostgreSQL (正式)
- 免費開源
- 強大穩定
- Cloudflare D1 替代方案

### 遷移流程
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## 測試要求

- **單元測試**：Pytest
- **整合測試**：FastAPI TestClient
- **覆蓋率目標**：80%+

## 部署流程

1. Git Push 觸發 CI
2. 自動執行測試
3. Docker 映像建置
4. 部署至 Railway / Render

## 緊急應變

- **API 500 錯誤**：檢查日誌、資料庫連線
- **效能問題**：加入快取、優化查詢
- **部署失敗**：檢查環境變數、依賴版本
