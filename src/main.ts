import { GomokuGame } from './game';
import { GameRenderer } from './renderer';
import { GameUI } from './ui';
import { GameConfig } from './types';

// 遊戲配置
const gameConfig: GameConfig = {
    boardSize: 15,      // 15x15 棋盤
    winLength: 5,       // 五子連線獲勝
    cellSize: 35,       // 每個格子 35px
    padding: 20         // 邊距 20px
};

// 等待 DOM 加載完成
document.addEventListener('DOMContentLoaded', () => {
    // 獲取 DOM 元素
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    // const currentPlayerElement = document.getElementById('current-player') as HTMLElement; // 移除
    const statusMessageElement = document.getElementById('status-message') as HTMLElement;
    const restartButton = document.getElementById('restart-btn') as HTMLButtonElement;

    if (!canvas || !statusMessageElement || !restartButton) {
        console.error('無法找到必要的 DOM 元素');
        return;
    }

    // 設置 Canvas 尺寸
    const totalSize = gameConfig.boardSize * gameConfig.cellSize + gameConfig.padding * 2;
    canvas.width = totalSize;
    canvas.height = totalSize;

    // 創建遊戲實例
    const game = new GomokuGame(gameConfig);
    const renderer = new GameRenderer(game, canvas);
    new GameUI(game, renderer, canvas, statusMessageElement, restartButton);

    // 初始渲染
    renderer.render();

    console.log('五子棋遊戲已啟動！');
    console.log('操作說明：');
    console.log('- 使用滑鼠點擊棋盤位置下棋');
    console.log('- 使用方向鍵移動游標，按空格鍵下棋');
    console.log('- 先連成五子的一方獲勝');
}); 