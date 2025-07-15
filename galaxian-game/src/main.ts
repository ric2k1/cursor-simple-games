import Game from './game';
import Renderer from './renderer';
import UI from './ui';
import { GameConfig } from './types';
import './style.css';

class GalaxianGame {
  private game: Game;

  private renderer: Renderer;

  private ui: UI;

  private canvas: HTMLCanvasElement;

  private animationId: number | null = null;

  private lastTime: number = 0;

  constructor() {
    // 初始化 canvas
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.canvas.width = 1200;
    this.canvas.height = 800;

    // 遊戲配置
    const config: GameConfig = {
      canvas: {
        width: 1200,
        height: 800,
      },
      player: {
        speed: 0.4,
        width: 50,
        height: 36,
        shootCooldown: 200,
      },
      enemy: {
        width: 36,
        height: 28,
        formationSpeed: 0.05,
        diveSpeed: 0.3,
        shootChance: 0.001,
      },
      bullet: {
        speed: 0.6,
        width: 4,
        height: 10,
      },
    };

    // 初始化組件
    this.game = new Game(config);
    this.renderer = new Renderer(this.canvas);
    this.ui = new UI();

    // 設置事件監聽
    this.setupEventListeners();

    // 顯示主選單
    this.showMenu();
  }

  private setupEventListeners(): void {
    this.ui.onStartClick(() => {
      this.startGame();
    });

    this.ui.onRestartClick(() => {
      this.startGame();
    });

    // 添加鍵盤快捷鍵控制音效
    let audioEnabled = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        const audioManager = this.game.getAudioManager();
        audioEnabled = !audioEnabled;
        audioManager.setEnabled(audioEnabled);
        UI.showAudioStatus(audioEnabled);
      }
    });
  }

  private showMenu(): void {
    this.ui.showMenu();
    const state = this.game.getState();
    this.ui.updateHighScore(state.highScore);
  }

  private startGame(): void {
    this.ui.showGame();
    this.game.startGame();
    this.lastTime = performance.now();
    this.gameLoop();
  }

  private gameLoop = (currentTime: number = 0): void => {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // 更新遊戲狀態
    this.game.update(deltaTime);
    const state = this.game.getState();

    // 更新 UI
    this.ui.updateScore(state.score);
    this.ui.updateLives(state.player.lives);
    this.ui.updateHighScore(state.highScore);

    // 渲染遊戲
    this.renderer.render(state);

    // 檢查遊戲狀態
    if (state.gameStatus === 'gameOver') {
      this.gameOver();
      return;
    }

    // 繼續遊戲循環
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private gameOver(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    const state = this.game.getState();
    this.ui.showGameOver(state.score);
    this.ui.updateHighScore(state.highScore);
  }
}

// 當頁面載入完成後初始化遊戲
window.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new GalaxianGame();
});
