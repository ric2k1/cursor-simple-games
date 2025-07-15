# Galaxian 遊戲音效功能

## 新增的音效功能

### 1. 音效序列播放

- 遊戲不再使用單一音效檔案
- 每個動作都會播放多個音效的組合，創造更豐富的聲音體驗

### 2. 音效類型

#### 玩家射擊 (playPlayerShoot)

- 組合音效：laser1 + zap1
- 延遲：0ms, 100ms

#### 敵人射擊 (playEnemyShoot)

- 組合音效：phaserDown1 + lowDown
- 延遲：0ms, 150ms

#### 敵人被擊中 (playEnemyHit)

- 組合音效：zapThreeToneDown + pepSound1 + highDown
- 延遲：0ms, 200ms, 400ms

#### 玩家被擊中 (playPlayerHit)

- 組合音效：zapTwoTone + phaserDown3 + lowRandom
- 延遲：0ms, 300ms, 600ms

#### 爆炸效果 (playExplosion)

- 組合音效：threeTone1 + spaceTrash1 + zapThreeToneUp
- 延遲：0ms, 200ms, 500ms

#### 遊戲結束 (playGameOver)

- 組合音效：phaserDown1 + phaserDown2 + phaserDown3 + lowThreeTone
- 延遲：0ms, 500ms, 1000ms, 1500ms

#### 關卡完成 (playLevelComplete)

- 組合音效：powerUp1 + powerUp2 + powerUp3 + phaserUp1 + phaserUp2
- 延遲：0ms, 200ms, 400ms, 600ms, 800ms

#### 遊戲開始 (playGameStart)

- 組合音效：phaseJump1 + phaserUp4 + powerUp12
- 延遲：0ms, 300ms, 600ms

### 3. 背景音樂循環

- 使用多個音效檔案組合創造連續的背景音樂
- 音效序列：lowThreeTone → spaceTrash1 → phaserUp1 → spaceTrash2 → tone1 → spaceTrash3 → phaserDown1 → spaceTrash4
- 每個音效間隔 1 秒

### 4. 音效控制

- 按 'M' 鍵切換音效開關
- 可以調整主音量和背景音樂音量
- 音效預加載以減少延遲

### 5. 音效管理

- 使用 AudioManager 類統一管理所有音效
- 支援音效快取和錯誤處理
- 可以隨時停止所有音效

## 使用方法

1. 遊戲會自動播放背景音樂
2. 各種遊戲動作會觸發對應的音效序列
3. 按 'M' 鍵可以開關音效
4. 音效開關狀態會在控制台顯示

## 技術實現

- 使用 Web Audio API
- 音效預加載和快取
- 支援音效序列播放
- 錯誤處理和容錯機制
- 音量控制和淡入淡出效果
