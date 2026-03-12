# Database Engineer Skill

> 職位：資料庫工程師 | 技術棧：SQLite / PostgreSQL / Prisma

## 核心職責

1. **資料庫設計與建模**
2. **遷移腳本管理**
3. **效能優化**
4. **備份與還原**

## 技術選型

### 開發環境
- **資料庫**：SQLite 3
- **優點**：免安裝、輕量、檔案即資料庫
- **適合**：開發、測試、小型專案

### 正式環境
- **首選**：PostgreSQL
- **替代**：Cloudflare D1 (SQLite 雲端版)
- **優點**：免費、強大、穩定

### ORM 工具
- **Python**：SQLAlchemy 2.0 + Alembic
- **Node.js**：Prisma (現代 ORM)

## 資料庫設計原則

### 正規化 (Normalization)
- 第一正規化 (1NF)：不可有重複群組
- 第二正規化 (2NF)：完全函數依賴
- 第三正規化 (3NF)：無遞移依賴

### 命名規範
```sql
-- Table: 複數名稱 snake_case
CREATE TABLE user_profiles ();

-- Column: snake_case
created_at, updated_at, is_active

-- Primary Key
id (INTEGER PRIMARY KEY)

-- Foreign Key
user_id, project_id
```

### 通用欄位
```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
is_active BOOLEAN DEFAULT TRUE
```

## 遷移管理

### Alembic (Python)
```bash
# 建立遷移
alembic revision --autogenerate -m "add_user_table"

# 執行遷移
alembic upgrade head

# 回滾遷移
alembic downgrade -1
```

### Prisma (Node.js)
```bash
# 建立遷移
prisma migrate dev --name init

# 部署遷移
prisma migrate deploy
```

## 效能優化

### 索引 (Index)
```sql
-- 經常查詢的欄位建立索引
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_project_status ON projects(status);
```

### 查詢優化
- 避免 SELECT *，指定需要的欄位
- 使用 LIMIT 限制結果數量
- JOIN 前先過濾資料

### 快取策略
- Redis 快取熱門資料
- 設定 TTL 過期時間

## 備份與還原

### SQLite 備份
```bash
# 複製資料庫檔案
cp database.db database_backup.db

# 或使用 sqlite3
sqlite3 database.db ".backup database_backup.db"
```

### PostgreSQL 備份
```bash
# 匯出
pg_dump -U user database > backup.sql

# 匯入
psql -U user database < backup.sql
```

## 安全性

### 權限管理
- 最小權限原則
- 區分讀寫權限
- 定期更換密碼

### 敏感資料
- 密碼雜湊儲存 (bcrypt)
- 信用卡等敏感資訊加密
- 定期稽核存取日誌

## 監控與維運

### 連線池管理
- 設定最大/最小連線數
- 監控連線使用率

### 慢查詢日誌
- 記錄超過閾值的查詢
- 分析並優化

## 緊急應變

- **資料遺失**：從備份還原
- **效能下降**：檢查索引、優化查詢
- **連線池耗盡**：調整 pool size
