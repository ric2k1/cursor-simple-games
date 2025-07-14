# 五子棋遊戲

一個基於 TypeScript 和 HTML5 Canvas 的現代化五子棋遊戲，支持滑鼠和鍵盤操作。

## 功能特色

- 🎮 **雙人對戰**：支持兩個玩家輪流下棋
- 🖱️ **多種操作方式**：支持滑鼠點擊和鍵盤方向鍵操作
- 🎨 **現代化界面**：美觀的漸變背景和動畫效果
- 📱 **響應式設計**：適配不同屏幕尺寸
- ⚡ **流暢體驗**：實時游標顯示和狀態更新

## 遊戲規則

- 黑子先手，白子後手
- 在 15x15 的棋盤上輪流下棋
- 先連成五子（橫、豎、斜）的一方獲勝
- 棋盤滿子且無人獲勝則為平局

## 操作方式

### 滑鼠操作

- 直接點擊棋盤位置下棋

### 鍵盤操作

- **方向鍵**：移動游標
- **空格鍵**：在當前游標位置下棋
- **Enter 鍵**：遊戲結束後重新開始

## 技術棧

- **TypeScript**：類型安全的 JavaScript
- **HTML5 Canvas**：遊戲渲染
- **CSS3**：現代化樣式和動畫
- **Vite**：快速開發和構建工具

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 項目結構

```
src/
├── main.ts          # 應用入口
├── game.ts          # 遊戲邏輯核心
├── renderer.ts      # Canvas 渲染器
├── ui.ts           # 用戶界面控制器
├── types.ts        # TypeScript 類型定義
└── style.css       # 樣式文件
```

## 開發說明

### 遊戲配置

在 `src/main.ts` 中可以調整遊戲配置：

- `boardSize`：棋盤大小（預設 15x15）
- `winLength`：獲勝所需連子數（預設 5）
- `cellSize`：格子大小（預設 35px）
- `padding`：邊距（預設 20px）

### 自定義樣式

修改 `src/style.css` 可以自定義遊戲外觀和動畫效果。

## 瀏覽器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 授權

MIT License
