import {
  GameState, Player, Enemy, Bullet, Explosion, Star,
} from './types';

export default class Renderer {
  private ctx: CanvasRenderingContext2D;

  private canvas: HTMLCanvasElement;

  private enemyColors = {
    red: ['#ff0000', '#ff4444', '#ff8888'],
    purple: ['#0088ff', '#44aaff', '#88ccff'],
    yellow: ['#ffff00', '#ffff44', '#ffff88'],
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('無法獲取 canvas context');
    this.ctx = ctx;
  }

  public render(state: GameState): void {
    // 清除畫布
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 繪製星空背景
    this.renderStars(state.stars);

    // 繪製遊戲元素
    if (state.gameStatus === 'playing' || state.gameStatus === 'levelTransition' || state.gameStatus === 'gameOver') {
      this.renderPlayer(state.player);
      this.renderEnemies(state.enemies);
      this.renderBullets(state.playerBullets, '#00ff00');
      this.renderBullets(state.enemyBullets, '#ff00ff');
      this.renderExplosions(state.explosions);

      // 關卡過渡提示
      if (state.gameStatus === 'levelTransition') {
        this.renderLevelTransition(state.level);
      }
    }
  }

  private renderStars(stars: Star[]): void {
    stars.forEach((star) => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      this.ctx.fillRect(star.position.x, star.position.y, 2, 2);
    });
  }

  private renderPlayer(player: Player): void {
    const { x, y } = player.position;
    const w = player.width;
    const h = player.height;

    // 繪製經典的太空船形狀
    this.ctx.fillStyle = '#00ffff';
    this.ctx.beginPath();

    // 船身
    this.ctx.moveTo(x + w / 2, y);
    this.ctx.lineTo(x + w, y + h);
    this.ctx.lineTo(x + w * 0.8, y + h * 0.8);
    this.ctx.lineTo(x + w * 0.2, y + h * 0.8);
    this.ctx.lineTo(x, y + h);
    this.ctx.closePath();
    this.ctx.fill();

    // 駕駛艙
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.3);

    // 側翼
    this.ctx.fillStyle = '#0088ff';
    this.ctx.fillRect(x + w * 0.1, y + h * 0.6, w * 0.15, h * 0.3);
    this.ctx.fillRect(x + w * 0.75, y + h * 0.6, w * 0.15, h * 0.3);

    // 引擎火焰
    if (Math.random() > 0.5) {
      this.ctx.fillStyle = '#ff6600';
      this.ctx.beginPath();
      this.ctx.moveTo(x + w * 0.25, y + h);
      this.ctx.lineTo(x + w * 0.3, y + h + 18);
      this.ctx.lineTo(x + w * 0.35, y + h);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(x + w * 0.45, y + h);
      this.ctx.lineTo(x + w * 0.5, y + h + 18);
      this.ctx.lineTo(x + w * 0.55, y + h);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(x + w * 0.65, y + h);
      this.ctx.lineTo(x + w * 0.7, y + h + 18);
      this.ctx.lineTo(x + w * 0.75, y + h);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  private renderEnemies(enemies: Enemy[]): void {
    enemies.forEach((enemy) => {
      if (!enemy.active) return;

      const { x, y } = enemy.position;
      const w = enemy.width;
      const h = enemy.height;
      const colors = this.enemyColors[enemy.type];
      const colorIndex = Math.floor(enemy.animationFrame * colors.length);

      // 外星人身體
      this.ctx.fillStyle = colors[colorIndex % colors.length];

      switch (enemy.type) {
        case 'yellow': {
          // 旗艦外星人主體
          this.ctx.beginPath();
          this.ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 3, 0, 0, Math.PI * 2);
          this.ctx.fill();

          // 上半部分的艦橋
          this.ctx.fillStyle = colors[(colorIndex + 1) % colors.length];
          this.ctx.fillRect(x + w * 0.3, y, w * 0.4, h * 0.4);

          // 觸角/天線
          this.ctx.strokeStyle = colors[colorIndex % colors.length];
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.moveTo(x + w * 0.25, y);
          this.ctx.lineTo(x + w * 0.25, y - 8);
          this.ctx.moveTo(x + w * 0.75, y);
          this.ctx.lineTo(x + w * 0.75, y - 8);
          this.ctx.stroke();

          // 觸角末端
          this.ctx.fillStyle = '#ffaa00';
          this.ctx.fillRect(x + w * 0.23, y - 10, 4, 4);
          this.ctx.fillRect(x + w * 0.73, y - 10, 4, 4);
          break;
        }

        case 'red': {
          // 紅色外星人
          this.ctx.fillRect(x, y + h * 0.3, w, h * 0.4);
          this.ctx.beginPath();
          this.ctx.arc(x + w / 2, y + h * 0.5, w * 0.4, 0, Math.PI * 2);
          this.ctx.fill();

          // 翅膀
          const wingOffset = Math.sin(enemy.animationFrame * Math.PI * 2) * 2;
          this.ctx.beginPath();
          this.ctx.moveTo(x, y + h * 0.5);
          this.ctx.lineTo(x - 5, y + h * 0.5 + wingOffset);
          this.ctx.lineTo(x, y + h * 0.7);
          this.ctx.closePath();
          this.ctx.fill();

          this.ctx.beginPath();
          this.ctx.moveTo(x + w, y + h * 0.5);
          this.ctx.lineTo(x + w + 5, y + h * 0.5 - wingOffset);
          this.ctx.lineTo(x + w, y + h * 0.7);
          this.ctx.closePath();
          this.ctx.fill();
          break;
        }

        case 'purple': {
          // 紫色外星人
          this.ctx.beginPath();
          this.ctx.moveTo(x + w / 2, y);
          this.ctx.lineTo(x + w, y + h * 0.7);
          this.ctx.lineTo(x + w * 0.7, y + h);
          this.ctx.lineTo(x + w * 0.3, y + h);
          this.ctx.lineTo(x, y + h * 0.7);
          this.ctx.closePath();
          this.ctx.fill();
          break;
        }

        default:
          break;
      }

      // 眼睛
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(x + w * 0.3 - 4, y + h * 0.4, 8, 8);
      this.ctx.fillRect(x + w * 0.7 - 4, y + h * 0.4, 8, 8);

      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(x + w * 0.3 - 3, y + h * 0.4 + 1, 6, 6);
      this.ctx.fillRect(x + w * 0.7 - 3, y + h * 0.4 + 1, 6, 6);
    });
  }

  private renderBullets(bullets: Bullet[], color: string): void {
    this.ctx.fillStyle = color;
    bullets.forEach((bullet) => {
      if (!bullet.active) return;

      const { x, y } = bullet.position;

      // 繪製激光束效果
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = color;
      this.ctx.fillRect(x, y, bullet.width, bullet.height);

      // 加亮中心
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(
        x + bullet.width * 0.25,
        y + bullet.height * 0.25,
        bullet.width * 0.5,
        bullet.height * 0.5,
      );

      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = color;
    });
  }

  private renderExplosions(explosions: Explosion[]): void {
    explosions.forEach((explosion) => {
      const progress = explosion.currentTime / explosion.duration;
      const opacity = 1 - progress;

      // 爆炸環
      this.ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(
        explosion.position.x,
        explosion.position.y,
        explosion.radius,
        0,
        Math.PI * 2,
      );
      this.ctx.stroke();

      // 內部光暈
      this.ctx.fillStyle = `rgba(255, 100, 0, ${opacity * 0.5})`;
      this.ctx.beginPath();
      this.ctx.arc(
        explosion.position.x,
        explosion.position.y,
        explosion.radius * 0.6,
        0,
        Math.PI * 2,
      );
      this.ctx.fill();

      // 火花粒子
      const particleCount = 8;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = explosion.radius * 1.2;
        const px = explosion.position.x + Math.cos(angle) * distance;
        const py = explosion.position.y + Math.sin(angle) * distance;

        this.ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
        this.ctx.fillRect(px - 2, py - 2, 4, 4);
      }
    });
  }

  private renderLevelTransition(level: number): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = 'bold 48px "Orbitron", monospace';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.strokeStyle = '#ff8800';
    this.ctx.lineWidth = 2;
    this.ctx.strokeText(`LEVEL ${level}`, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText(`LEVEL ${level}`, this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.font = '24px "Orbitron", monospace';
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillText('GET READY!', this.canvas.width / 2, this.canvas.height / 2 + 60);
  }
}
