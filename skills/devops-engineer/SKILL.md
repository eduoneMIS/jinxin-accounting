# DevOps Engineer Skill

> 職位：Git/CI/CD 工程師 | 核心理念：免費優先、快速部署

## 核心職責

1. **版本控制管理**
2. **CI/CD 流水線建置**
3. **部署自動化**
4. **版本回滾機制**

## 技術選型（免費原則）

### 版本控制
- **平台**：GitHub (免費私有庫)
- **工具**：Git

### CI/CD
- **服務**：GitHub Actions (免費額度：2000分鐘/月)
- **特色**：免費、私有庫可用、community 支持

### 部署平台
- **前端**：Cloudflare Pages (無限頻寬、免費)
- **後端**：Railway (首月 $5 credit) / Render (免費額度)
- **資料庫**：Cloudflare D1 / SQLite

### 網域
- **DNS**：Cloudflare (免費)
- **SSL**：自動 Let's Encrypt

## Git Flow 分支策略

```
main (正式環境)
  │
  ├── develop (開發環境)
  │     │
  │     ├── feature/xxx (功能分支)
  │     │     │
  │     │     └── PR → develop
  │     │
  │     ├── fix/xxx (修復分支)
  │     │     │
  │     │     └── PR → develop
  │     │
  │     └── release/xxx (發布分支)
  │           │
  │           └── PR → main + develop
  │
  └── hotfix/xxx (緊急修復)
        │
        └── PR → main + develop
```

## Git 指令速查

### 基本操作
```bash
# 初始化
git init
git clone <url>

# 分支管理
git branch                  # 列出分支
git checkout -b feature/xxx # 建立並切換分支
git checkout develop        # 切換分支

# 提交
git add .
git commit -m "feat: add login"
git push origin develop

# 合併
git merge develop
git rebase develop
```

### 版本回滾
```bash
# 還原未提交的修改
git checkout -- .

# 還原某個檔案
git checkout HEAD~1 -- path/to/file

# 回滾到特定 Commit
git revert <commit-hash>

# 強制回滾到某個 Commit (慎用)
git reset --hard <commit-hash>
git push --force
```

## CI/CD 流水線設計

### 前端部署流程

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: my-app
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 後端部署流程

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          
      - name: Run tests
        run: pytest
        
      - name: Deploy to Railway
        uses: uetchy/railway-action@v1
        with:
          railwayToken: ${{ secrets.RAILWAY_TOKEN }}
          service: my-backend
```

## 版本回滾機制

### 方案一：Git Revert
```bash
# 產生新的 Revert Commit
git revert abc1234
git push origin main
```

### 方案二：重新部署舊版本
```bash
# Railway 部署特定 Commit
railway deploy --commit <git-commit-sha>

# Cloudflare Pages 部署特定 Commit
# 在 Cloudflare Dashboard 選擇歷史部署
```

### 方案三：資料庫回滾
```bash
# Alembic 回滾
alembic downgrade -1

# 或前進到特定版本
alembic upgrade <revision>
```

## 監控與報警

### 免費監控工具
- **Uptime**：Cloudflare Monitor (免費)
- **日誌**：Railway / Render 內建日誌
- **錯誤追蹤**：Sentry (免費額度)

### 報警設定
- GitHub Issues 開立追蹤
- Discord 機器人通知

## 成本優化策略

| 項目 | 免費方案 | 付費閾值 |
|------|----------|----------|
| Git 倉儲 | GitHub Free | $4/月 |
| CI/CD | GitHub Actions (2000分鐘) | $0.008/分鐘 |
| 前端托管 | Cloudflare Pages | - |
| 後端托管 | Railway $5 credit | $0.001/分鐘 |
| 資料庫 | Cloudflare D1 | - |
| 網域 DNS | Cloudflare | - |
| SSL | Let's Encrypt | - |

## 緊急應變

- **部署失敗**：查看 Actions 日誌、回滾到上一個穩定版本
- **網站無法訪問**：檢查 Cloudflare 狀態、切換到備援部署
- **資料庫問題**：從備份還原、聯繫平台支援
