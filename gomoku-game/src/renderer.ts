import GomokuGame from './game';
import {
  GameState, Position, WinLine, Confetti,
} from './types';

export default class GameRenderer {
  private game: GomokuGame;

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  private confetti: Confetti[] = [];

  private confettiAnimationId: number | null = null;

  private lastWinner: string | null = null;

  // 新增属性
  private screenFlash: number = 0;

  constructor(game: GomokuGame, canvas: HTMLCanvasElement) {
    this.game = game;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    GameRenderer.initVictorySound();
  }

  private static initVictorySound(): void {
    // 创建胜利音效（使用Web Audio API生成）
    try {
      const audioContext = new (window.AudioContext
        || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // console.log('音效初始化失败');
    }
  }

  public render(): void {
    const state = this.game.getState();

    // 检查是否有新的获胜者
    if (state.winner && state.winner !== this.lastWinner) {
      this.lastWinner = state.winner;
      this.createConfetti();
      this.triggerScreenFlash();
    }

    // 清除画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制棋盘背景
    this.drawBoard();

    // 绘制棋子
    this.drawStones(state);

    // 绘制获胜线
    if (state.winLine) {
      this.drawWinLine(state.winLine);
    }

    // 绘制彩带
    this.drawConfetti();

    // 绘制屏幕闪烁效果
    this.drawScreenFlash();
  }

  private triggerScreenFlash(): void {
    this.screenFlash = 10; // 闪烁持续时间
    GameRenderer.playVictorySound();
  }

  private static playVictorySound(): void {
    try {
      const applause = new Audio('/applause.mp3');
      applause.volume = 0.7;
      applause.play();
    } catch {
      // console.log('音效播放失敗');
    }
  }

  private drawScreenFlash(): void {
    if (this.screenFlash > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = (this.screenFlash / 10) * 0.3;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
      this.screenFlash--;
    }
  }

  private drawBoard(): void {
    const config = this.game.getConfig();
    const { cellSize } = config;
    const { padding } = config;

    // 繪製棋盤背景
    this.ctx.fillStyle = '#f4d03f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 繪製網格線
    this.ctx.strokeStyle = '#34495e';
    this.ctx.lineWidth = 2;

    for (let i = 0; i <= config.boardSize; i++) {
      const pos = i * cellSize + padding;

      // 垂直線
      this.ctx.beginPath();
      this.ctx.moveTo(pos, padding);
      this.ctx.lineTo(pos, config.boardSize * cellSize + padding);
      this.ctx.stroke();

      // 水平線
      this.ctx.beginPath();
      this.ctx.moveTo(padding, pos);
      this.ctx.lineTo(config.boardSize * cellSize + padding, pos);
      this.ctx.stroke();
    }
  }

  private drawStones(state: GameState): void {
    const config = this.game.getConfig();
    const { cellSize } = config;
    const { padding } = config;
    const radius = cellSize * 0.4;

    for (let row = 0; row < config.boardSize; row++) {
      for (let col = 0; col < config.boardSize; col++) {
        const stone = state.board[row][col];
        if (stone) {
          const x = col * cellSize + padding + cellSize / 2;
          const y = row * cellSize + padding + cellSize / 2;

          // 繪製陰影
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          this.ctx.beginPath();
          this.ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2);
          this.ctx.fill();

          // 繪製棋子
          const gradient = this.ctx.createRadialGradient(
            x - radius * 0.3,
            y - radius * 0.3,
            0,
            x,
            y,
            radius,
          );

          if (stone === 'black') {
            gradient.addColorStop(0, '#2c3e50');
            gradient.addColorStop(1, '#34495e');
          } else {
            gradient.addColorStop(0, '#ecf0f1');
            gradient.addColorStop(1, '#bdc3c7');
          }

          this.ctx.fillStyle = gradient;
          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  private drawWinLine(winLine: WinLine): void {
    const config = this.game.getConfig();
    const { cellSize } = config;
    const { padding } = config;

    const startX = winLine.start.col * cellSize + padding + cellSize / 2;
    const startY = winLine.start.row * cellSize + padding + cellSize / 2;
    const endX = winLine.end.col * cellSize + padding + cellSize / 2;
    const endY = winLine.end.row * cellSize + padding + cellSize / 2;

    this.ctx.strokeStyle = '#e74c3c';
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }

  private createConfetti(): void {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
    ];

    const shapes: Array<'square' | 'circle' | 'triangle' | 'star' | 'diamond'> = [
      'square', 'circle', 'triangle', 'star', 'diamond',
    ];

    // 获取窗口尺寸，让彩带可以飘到整个窗口
    const windowWidth = window.innerWidth;

    // 创建更多彩带粒子
    for (let i = 0; i < 150; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const confetti: Confetti = {
        x: Math.random() * windowWidth, // 使用窗口宽度
        y: -50 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 0.3 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        life: 0,
        maxLife: Math.random() * 1200 + 900,
        shape,
        scale: Math.random() * 0.5 + 0.8,
        opacity: 1,
        trail: [],
        windEffect: (Math.random() - 0.5) * 0.05,
        bounceCount: 0,
        maxBounces: Math.floor(Math.random() * 3) + 1,
        glowEffect: Math.random() > 0.7,
        sparkleEffect: Math.random() > 0.8,
        delay: Math.floor(Math.random() * 120), // 0~120 幀延遲，時間差更大
      };
      this.confetti.push(confetti);
    }

    // 开始彩带动画
    if (this.confettiAnimationId) {
      cancelAnimationFrame(this.confettiAnimationId);
    }
    this.animateConfetti();
  }

  private animateConfetti(): void {
    // 更新彩带位置
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const confetti = this.confetti[i];
      // 新增：延遲啟動
      if (confetti.life < confetti.delay) {
        confetti.life++;
      } else {
        // 添加轨迹
        confetti.trail.push({
          x: confetti.x,
          y: confetti.y,
          opacity: confetti.opacity,
        });

        // 限制轨迹长度
        if (confetti.trail.length > 10) {
          confetti.trail.shift();
        }

        // 更新位置
        confetti.x += confetti.vx;
        confetti.y += confetti.vy;
        confetti.rotation += confetti.rotationSpeed;
        confetti.life++;

        // 风力效果
        confetti.vx += confetti.windEffect;

        // 重力效果 - 大幅降低，让彩带非常缓慢下降
        confetti.vy += 0.01;

        // 空气阻力 - 降低阻力，让彩带飘得更久
        confetti.vx *= 0.999;
        confetti.vy *= 0.999;

        // 边界碰撞检测 - 使用窗口尺寸
        if (confetti.x < 0 || confetti.x > window.innerWidth) {
          confetti.vx *= -0.8;
          confetti.x = Math.max(0, Math.min(window.innerWidth, confetti.x));
        }

        // 底部彈跳 - 使用窗口高度
        if (confetti.y > window.innerHeight) {
          // 觸底直接消失
          this.confetti.splice(i, 1);
        } else {
          // 更新透明度
          confetti.opacity = Math.max(0, 1 - confetti.life / confetti.maxLife);

          // 移除过期的彩带 - 使用窗口高度
          if (confetti.life > confetti.maxLife
                    || (confetti.y > window.innerHeight + 100
                        && confetti.bounceCount >= confetti.maxBounces)) {
            this.confetti.splice(i, 1);
          }
        }
      }
    }

    // 重新渲染
    this.render();

    // 如果还有彩带，继续动画
    if (this.confetti.length > 0) {
      this.confettiAnimationId = requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiAnimationId = null;
    }
  }

  private drawConfetti(): void {
    // 保存当前canvas上下文状态
    this.ctx.save();

    // 获取窗口尺寸
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 临时创建一个全屏的绘制上下文
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = windowWidth;
    tempCanvas.height = windowHeight;
    tempCanvas.style.position = 'fixed';
    tempCanvas.style.top = '0';
    tempCanvas.style.left = '0';
    tempCanvas.style.pointerEvents = 'none';
    tempCanvas.style.zIndex = '1000';
    document.body.appendChild(tempCanvas);

    const tempCtx = tempCanvas.getContext('2d')!;

    this.confetti.forEach((confetti) => {
      tempCtx.save();
      tempCtx.translate(confetti.x, confetti.y);
      tempCtx.rotate((confetti.rotation * Math.PI) / 180);
      tempCtx.scale(confetti.scale, confetti.scale);

      // 绘制轨迹
      GameRenderer.drawConfettiTrailOnContext(
        tempCtx,
        confetti,
      );

      // 发光效果
      if (confetti.glowEffect) {
        tempCtx.shadowColor = confetti.color;
        tempCtx.shadowBlur = 15;
      }

      // 设置透明度
      tempCtx.globalAlpha = confetti.opacity;

      // 绘制彩带形状
      GameRenderer.drawConfettiShapeOnContext(
        tempCtx,
        confetti,
      );

      // 闪烁效果
      if (confetti.sparkleEffect && Math.random() > 0.95) {
        GameRenderer.drawSparkleOnContext(
          tempCtx,
          confetti,
        );
      }

      tempCtx.restore();
    });

    // 清理临时canvas
    setTimeout(() => {
      if (document.body.contains(tempCanvas)) {
        document.body.removeChild(tempCanvas);
      }
    }, 100);

    this.ctx.restore();
  }

  private static drawConfettiTrailOnContext(
    ctx: CanvasRenderingContext2D,
    confetti: Confetti,
  ): void {
    if (confetti.trail.length < 2) return;

    ctx.strokeStyle = confetti.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(confetti.trail[0].x - confetti.x, confetti.trail[0].y - confetti.y);

    for (let i = 1; i < confetti.trail.length; i++) {
      const point = confetti.trail[i];
      ctx.lineTo(point.x - confetti.x, point.y - confetti.y);
      ctx.globalAlpha = point.opacity * 0.3;
    }

    ctx.stroke();
  }

  private static drawConfettiShapeOnContext(
    ctx: CanvasRenderingContext2D,
    confetti: Confetti,
  ): void {
    const { size } = confetti;
    const halfSize = size / 2;

    switch (confetti.shape) {
      case 'square':
        ctx.fillStyle = confetti.color;
        ctx.fillRect(-halfSize, -halfSize, size, size);
        break;

      case 'circle':
        ctx.fillStyle = confetti.color;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'triangle':
        ctx.fillStyle = confetti.color;
        ctx.beginPath();
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(-halfSize, halfSize);
        ctx.lineTo(halfSize, halfSize);
        ctx.closePath();
        ctx.fill();
        break;

      case 'star':
        GameRenderer.drawStarOnContext(
          ctx,
          confetti.color,
          halfSize,
        );
        break;

      case 'diamond':
        ctx.fillStyle = confetti.color;
        ctx.beginPath();
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(halfSize, 0);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(-halfSize, 0);
        ctx.closePath();
        ctx.fill();
        break;
      default:
        // 預設為圓形
        ctx.fillStyle = confetti.color;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  private static drawStarOnContext(
    ctx: CanvasRenderingContext2D,
    color: string,
    size: number,
  ): void {
    ctx.fillStyle = color;
    ctx.beginPath();

    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fill();
  }

  private static drawSparkleOnContext(
    ctx: CanvasRenderingContext2D,
    confetti: Confetti,
  ): void {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    const sparkleSize = confetti.size * 0.8;

    // 绘制十字星
    ctx.beginPath();
    ctx.moveTo(-sparkleSize, 0);
    ctx.lineTo(sparkleSize, 0);
    ctx.moveTo(0, -sparkleSize);
    ctx.lineTo(0, sparkleSize);
    ctx.stroke();

    ctx.restore();
  }

  public getCanvasPosition(event: MouseEvent): Position | null {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const config = this.game.getConfig();
    const { cellSize } = config;
    const { padding } = config;

    const col = Math.floor((x - padding) / cellSize);
    const row = Math.floor((y - padding) / cellSize);

    if (col >= 0 && col < config.boardSize && row >= 0 && row < config.boardSize) {
      return { row, col };
    }

    return null;
  }

  public clearConfetti(): void {
    this.confetti = [];
    if (this.confettiAnimationId) {
      cancelAnimationFrame(this.confettiAnimationId);
      this.confettiAnimationId = null;
    }
  }
}
