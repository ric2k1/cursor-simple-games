import GomokuGame from './game';
import GameRenderer from './renderer';
import { Position } from './types';

export default class GameUI {
  private game: GomokuGame;

  private renderer: GameRenderer;

  private canvas: HTMLCanvasElement;

  private statusMessageElement: HTMLElement;

  private restartButton: HTMLButtonElement;

  private lastMoveTime: number = 0;

  private undoTimeout: number = 2000; // 2秒內可以undo

  constructor(
    game: GomokuGame,
    renderer: GameRenderer,
    canvas: HTMLCanvasElement,
    statusMessageElement: HTMLElement,
    restartButton: HTMLButtonElement,
  ) {
    this.game = game;
    this.renderer = renderer;
    this.canvas = canvas;
    this.statusMessageElement = statusMessageElement;
    this.restartButton = restartButton;

    this.setupEventListeners();
    this.updateUI();
  }

  private setupEventListeners(): void {
    // 滑鼠點擊事件
    this.canvas.addEventListener('click', (event) => {
      this.handleCanvasClick(event);
    });

    // 鍵盤事件
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });

    // 重新開始按鈕
    this.restartButton.addEventListener('click', () => {
      this.handleRestart();
    });
  }

  private handleCanvasClick(event: MouseEvent): void {
    const position = this.renderer.getCanvasPosition(event);
    if (position) {
      this.makeMove(position);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const state = this.game.getState();

    if (state.gameOver) {
      if (event.code === 'Space' || event.code === 'Enter') {
        this.handleRestart();
      }
      return;
    }

    // 處理 undo (Command-Z on Mac, Control-Z on Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.code === 'KeyZ') {
      event.preventDefault();
      this.handleUndo();
    }

    // 移除游標相關的鍵盤事件，因為游標不再顯示
    // 只保留空格鍵重新開始遊戲的功能
  }

  private makeMove(position: Position): void {
    const success = this.game.makeMove(position);
    if (success) {
      this.lastMoveTime = Date.now();
      this.updateUI();
      this.renderer.render();
    }
  }

  private handleUndo(): void {
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - this.lastMoveTime;

    // 檢查是否在2秒內
    if (timeSinceLastMove > this.undoTimeout) {
      return;
    }

    const success = this.game.undo();
    if (success) {
      this.updateUI();
      this.renderer.render();
    }
  }

  private handleRestart(): void {
    this.game.restart();
    this.renderer.clearConfetti();

    // 清除所有特效（虽然现在没有添加，但保留以防万一）
    this.statusMessageElement.classList.remove('victory-effect', 'pulse-effect', 'rainbow-border', 'flip-3d');
    this.canvas.classList.remove('victory-state', 'bounce-effect');

    this.updateUI();
    this.renderer.render();
  }

  private updateUI(): void {
    const state = this.game.getState();

    if (state.gameOver) {
      if (state.winner) {
        const winnerText = state.winner === 'black' ? '黑子' : '白子';
        this.statusMessageElement.textContent = `🎉 ${winnerText}獲勝！🎉 按空格鍵或點擊重新開始按鈕開始新遊戲`;
        this.statusMessageElement.style.background = 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)';
        this.statusMessageElement.style.color = '#222';
        this.statusMessageElement.style.textShadow = 'none';
        this.statusMessageElement.style.fontWeight = 'bold';

        // 移除所有动画效果，只保留基本样式
        this.statusMessageElement.classList.remove('victory-effect', 'pulse-effect', 'rainbow-border', 'flip-3d');
        this.canvas.classList.remove('victory-state', 'bounce-effect');
      } else {
        this.statusMessageElement.textContent = '平局！按空格鍵或點擊重新開始按鈕開始新遊戲';
        this.statusMessageElement.style.background = 'linear-gradient(90deg, #fdf6e3 0%, #fae1b6 100%)';
        this.statusMessageElement.style.color = '#7a5c00';
        this.statusMessageElement.style.textShadow = 'none';
        this.statusMessageElement.style.fontWeight = 'bold';

        // 移除胜利特效
        this.statusMessageElement.classList.remove('victory-effect', 'pulse-effect', 'rainbow-border', 'flip-3d');
        this.canvas.classList.remove('victory-state', 'bounce-effect');
      }
    } else {
      const playerText = state.currentPlayer === 'black' ? '黑子' : '白子';
      this.statusMessageElement.textContent = `輪到${playerText}下棋`;

      // 移除所有特效
      this.statusMessageElement.classList.remove('victory-effect', 'pulse-effect', 'rainbow-border', 'flip-3d');
      this.canvas.classList.remove('victory-state', 'bounce-effect');

      if (state.currentPlayer === 'black') {
        this.statusMessageElement.style.background = '#222'; // 黑色底
        this.statusMessageElement.style.color = '#ffb300'; // 橙黃色字
      } else {
        this.statusMessageElement.style.background = '#fff'; // 白色底
        this.statusMessageElement.style.color = '#b26c00'; // 深橙色字
      }
    }
  }

  public render(): void {
    this.renderer.render();
  }
}
