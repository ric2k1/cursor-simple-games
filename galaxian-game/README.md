# Galaxian 銀河戰士

經典街機遊戲 Galaxian 的網頁版實現，使用 TypeScript + Vite 開發。

## 遊戲介紹

Galaxian 是一款經典的太空射擊遊戲，玩家控制底部的太空船，射擊從上方編隊攻擊的外星人。本版本重現了經典的遊戲體驗，包括：

- 🚀 經典的太空船設計
- 👾 三種不同類型的外星人（黃色、紅色、紫色）
- 🎯 外星人會俯衝攻擊玩家
- 💥 華麗的爆炸效果
- ⭐ 動態星空背景
- 🏆 高分紀錄系統

## 如何遊玩

### 控制方式

- **← →** 方向鍵：移動太空船
- **空白鍵**：發射子彈

### 遊戲規則

- 擊中外星人獲得分數（黃色 50 分、紅色 30 分、紫色 20 分）
- 俯衝中的外星人分數加倍
- 玩家有 3 條生命
- 清除所有外星人進入下一關
- 每一關外星人移動速度會加快

## 開發指南

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 建置專案

```bash
npm run build
```

### 預覽建置結果

```bash
npm run preview
```

## 專案結構

```
galaxian-game/
├── src/
│   ├── game.ts      # 遊戲核心邏輯
│   ├── renderer.ts  # 渲染引擎
│   ├── ui.ts        # UI 管理器
│   ├── types.ts     # TypeScript 型別定義
│   ├── main.ts      # 主程式入口
│   └── style.css    # 遊戲樣式
├── public/          # 靜態資源（音效等）
├── index.html       # 主頁面
├── package.json     # 專案配置
├── tsconfig.json    # TypeScript 配置
└── vite.config.ts   # Vite 配置
```

## 技術特色

- 🎮 純 TypeScript 實現，無框架依賴
- 🎨 Canvas 2D 渲染，流暢的 60 FPS 遊戲體驗
- 🌟 復古街機風格的視覺效果
- 📱 響應式設計（建議在桌面瀏覽器遊玩）
- 💾 本地儲存高分紀錄

## 致敬

本遊戲是對 1979 年 Namco 推出的經典街機遊戲 Galaxian 的致敬之作。
