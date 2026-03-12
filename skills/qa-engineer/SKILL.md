# QA Engineer Skill

> 職位：測試工程師 | 技術棧：Jest + Playwright + Cloudflare Pages

## 核心職責

1. **撰寫單元測試與整合測試**
2. **執行 E2E 測試**
3. **驗證前後端串接**
4. **DEMO 展示給使用者確認**

## 測試策略

### 測試金字塔

```
        /\
       /  \      E2E Tests (少量)
      /----\     重要情境覆蓋
     /      \
    /--------\  Integration Tests (中等)
   /          \ API 串接測試
  /------------\ Unit Tests (大量)
 /              \ 單一函式/元件測試
```

## 技術選型

### 前端測試
- **單元測試**：Jest
- **元件測試**：React Testing Library
- **E2E 測試**：Playwright

### 後端測試
- **單元測試**：Pytest
- **整合測試**：FastAPI TestClient

### DEMO 展示
- **平台**：Cloudflare Pages
- **特色**：免費、快速、HTTP/HTTPS 支援

## 測試用例設計

### 功能測試
- [ ] 輸入驗證正確運作
- [ ] 資料 CRUD 操作正常
- [ ] 權限控制正確
- [ ] 錯誤處理完善

### 介面測試
- [ ] 頁面載入正常
- [ ] 按鈕點擊有反應
- [ ] 表單提交成功
- [ ] 資料正確顯示

### 相容性測試
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] 行動裝置瀏覽器

## Jest 測試範例

```javascript
// component.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyButton from './MyButton';

describe('MyButton', () => {
  test('renders button with text', () => {
    render(<MyButton>Click me</MyButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<MyButton onClick={handleClick}>Click me</MyButton>);
    await user.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Playwright E2E 測試範例

```javascript
// e2e/login.spec.js
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');
});
```

## CI/CD 整合

### GitHub Actions

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run E2E tests
        run: npx playwright test
```

## DEMO 展示流程

### 1. 部署預覽環境
- 每次 PR 自動部署 Preview URL
- 可分享給使用者測試

### 2. 功能確認清單
- [ ] 登入/登出正常
- [ ] 資料新增成功
- [ ] 資料修改成功
- [ ] 資料刪除成功
- [ ] 權限控制正確

### 3. 收集回饋
- 記錄使用者問題
- 優先修復 critical bugs
- 確認上線日期

## 品質指標

### 覆蓋率目標
- **單元測試**：80%+
- **整合測試**：60%+
- **E2E 測試**：核心流程 100%

### 測試通過標準
- 所有單元測試通過
- 所有整合測試通過
- 所有 E2E 測試通過
- 無 Critical/High 優先級 bug

## 緊急應變

- **測試失敗**：立即通知開發者修復
- **DEMO 失敗**：準備備援方案（本地演示）
- **上線後 bug**：啟動 hotfix 分支修復
