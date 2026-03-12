# 💰 金鑫記帳系統

金鑫教育股份有限公司 - 記帳網站

## 功能

- ✅ 用戶註冊/登入
- ✅ 收支紀錄 CRUD
- ✅ 分類管理（預設 + 自訂）
- ✅ 月度統計圖表
- ✅ 收入/支出分布圖
- ✅ 快速記錄按鈕

## 技術棧

- **前端**：React 18 + Vite + TailwindCSS + Zustand + Recharts
- **後端**：Python FastAPI + SQLAlchemy
- **資料庫**：SQLite（開發）

## 快速啟動

### 後端

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

## 部署

- 前端：Cloudflare Pages（免費）
- 後端：Railway / Render（免費額度）

## API 文件

啟動後端後訪問：http://localhost:8000/docs
