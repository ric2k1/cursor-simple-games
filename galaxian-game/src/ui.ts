export default class UI {
  private menuScreen: HTMLElement;

  private gameScreen: HTMLElement;

  private gameOverScreen: HTMLElement;

  private startButton: HTMLElement;

  private restartButton: HTMLElement;

  private scoreDisplay: HTMLElement;

  private livesDisplay: HTMLElement;

  private highScoreDisplay: HTMLElement;

  private currentHighScoreDisplay: HTMLElement;

  private finalScoreDisplay: HTMLElement;

  constructor() {
    // 獲取所有 UI 元素
    this.menuScreen = UI.getElement('menu-screen');
    this.gameScreen = UI.getElement('game-screen');
    this.gameOverScreen = UI.getElement('game-over-screen');
    this.startButton = UI.getElement('start-button');
    this.restartButton = UI.getElement('restart-button');
    this.scoreDisplay = UI.getElement('current-score');
    this.livesDisplay = UI.getElement('current-lives');
    this.highScoreDisplay = UI.getElement('high-score');
    this.currentHighScoreDisplay = UI.getElement('current-high-score');
    this.finalScoreDisplay = UI.getElement('final-score');
  }

  private static getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`找不到元素: ${id}`);
    return element;
  }

  public showMenu(): void {
    this.hideAllScreens();
    this.menuScreen.classList.add('active');
  }

  public showGame(): void {
    this.hideAllScreens();
    this.gameScreen.classList.add('active');
  }

  public showGameOver(finalScore: number): void {
    this.menuScreen.classList.remove('active');
    // 保持遊戲畫面顯示，讓遊戲結束文字覆蓋在上面
    this.gameScreen.classList.add('active');
    this.gameOverScreen.classList.add('active');
    this.finalScoreDisplay.textContent = finalScore.toString();
  }

  private hideAllScreens(): void {
    this.menuScreen.classList.remove('active');
    this.gameScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');
  }

  public updateScore(score: number): void {
    this.scoreDisplay.textContent = score.toString();
  }

  public updateLives(lives: number): void {
    // 清除現有的太空船圖形
    this.livesDisplay.innerHTML = '';

    // 為每條生命創建一個太空船圖形
    for (let i = 0; i < lives; i++) {
      const shipElement = document.createElement('div');
      shipElement.className = 'life-ship';
      shipElement.innerHTML = `
                <svg width="30" height="24" viewBox="0 0 30 24" xmlns="http://www.w3.org/2000/svg">
                    <!-- 太空船主體 -->
                    <polygon points="15,2 24,20 20,18 10,18 6,20" fill="#00ffff" stroke="#0088ff" stroke-width="1"/>
                    <!-- 駕駛艙 -->
                    <rect x="12" y="8" width="6" height="6" fill="#ffffff"/>
                    <!-- 左側翼 -->
                    <rect x="3" y="14" width="4" height="6" fill="#0088ff"/>
                    <!-- 右側翼 -->
                    <rect x="23" y="14" width="4" height="6" fill="#0088ff"/>
                </svg>
            `;
      this.livesDisplay.appendChild(shipElement);
    }
  }

  public updateHighScore(highScore: number): void {
    this.highScoreDisplay.textContent = highScore.toString();
    this.currentHighScoreDisplay.textContent = highScore.toString();
  }

  public onStartClick(callback: () => void): void {
    this.startButton.addEventListener('click', callback);
  }

  public onRestartClick(callback: () => void): void {
    this.restartButton.addEventListener('click', callback);
  }

  public static playSound(soundName: string): void {
    const audio = new Audio(`/${soundName}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // 音效播放失敗
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static showAudioStatus(_isEnabled: boolean): void {
    // 可以在此處添加音效狀態顯示
  }
}
