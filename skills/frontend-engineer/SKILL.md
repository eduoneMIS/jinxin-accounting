# Frontend Engineer Skill

> 職位：前端工程師 | 技術棧：React + Vite + TailwindCSS

## 核心職責

1. **根據開發書實作前端頁面**
2. **串接 API 並處理資料流**
3. **確保 UI/UX 符合現代設計趨勢**
4. **響應式設計支援**

## 技術選型

### 核心技術
- **框架**：React 18+
- **構建工具**：Vite 5+ (快速、輕量)
- **樣式**：TailwindCSS 3+ (原子化 CSS)
- **狀態管理**：Zustand (輕量)
- **路由**：React Router 6+
- **API 客戶端**：Axios 或 Fetch

### 可選技術
- **表單處理**：React Hook Form + Zod
- **UI 元件庫**：Shadcn/ui (可自訂)
- **圖表**：Recharts (輕量)
- **動畫**：Framer Motion

## 設計原則

### UI/UX 趨勢 (2024-2025)
- **極簡主義**：少即是多
- **大膽配色**：鮮豔的 accent colors
- **玻璃擬態**：Glassmorphism 效果
- **微互動**：細緻的 hover/click 動畫
- **深色模式**：必備支援

### RWD 響應式
```
 breakpoints:
 - mobile: < 640px
 - tablet: 640px - 1024px
 - desktop: > 1024px
```

## 開發規範

### 專案結構
```
src/
├── api/          # API 呼叫
├── components/  # 共用元件
├── pages/       # 頁面元件
├── hooks/       # 自訂 Hooks
├── store/       # 狀態管理
├── utils/       # 工具函式
├── styles/      # 全域樣式
└── App.tsx      # 入口元件
```

### 命名規範
- 元件：PascalCase (e.g., `UserCard.tsx`)
- 鉤子：camelCase + use 前綴 (e.g., `useUser.ts`)
- 工具：camelCase (e.g., `formatDate.ts`)

### Code Review 要點
- [ ] 元件职责单一
- [ ] 無冗餘程式碼
- [ ] 錯誤處理完善
- [ ] 類型定義完整

## 測試要求

- **單元測試**：Jest + React Testing Library
- **覆蓋率目標**：80%+
- **E2E 測試**：Playwright (核心流程)

## 部署流程

1. Git Push 觸發 CI
2. GitHub Actions 自動建置
3. 部署至 Cloudflare Pages
4. 自動產生 Preview URL

## 緊急應變

- **Build 失敗**：檢查依賴版本相容性
- **API 串接失敗**：檢查 CORS 設定
- **樣式異常**：檢查 TailwindCSS 配置
