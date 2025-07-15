import {
  GameState, GameConfig, Player, Enemy, Star,
} from './types';
import AudioManager from './audioManager';

export default class Game {
  private state: GameState;

  private config: GameConfig;

  private audioManager: AudioManager;

  private keys: { [key: string]: boolean } = {};

  private lastEnemyShootTime: number = 0;

  private enemyShootInterval: number = 1000;

  private levelTransitionTimer: number = 0;

  private levelTransitionDuration: number = 3000; // 3秒

  constructor(config: GameConfig) {
    this.config = config;
    this.audioManager = new AudioManager();
    this.state = this.initializeState();
    this.setupKeyboardListeners();
  }

  private initializeState(): GameState {
    const highScore = parseInt(localStorage.getItem('galaxianHighScore') || '0', 10);

    return {
      player: this.createPlayer(),
      enemies: [],
      playerBullets: [],
      enemyBullets: [],
      explosions: [],
      stars: this.createStarfield(),
      score: 0,
      highScore,
      level: 1,
      gameStatus: 'menu',
      enemyFormation: {
        offsetX: 0,
        direction: 1,
        speed: this.config.enemy.formationSpeed,
      },
    };
  }

  private createPlayer(): Player {
    return {
      position: {
        x: this.config.canvas.width / 2 - this.config.player.width / 2,
        y: this.config.canvas.height - 80,
      },
      width: this.config.player.width,
      height: this.config.player.height,
      lives: 3,
      active: true,
      canShoot: true,
      shootCooldown: 0,
    };
  }

  private createStarfield(): Star[] {
    const stars: Star[] = [];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        position: {
          x: Math.random() * this.config.canvas.width,
          y: Math.random() * this.config.canvas.height,
        },
        speed: 0.5 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }

    return stars;
  }

  private createEnemyFormation(): Enemy[] {
    const enemies: Enemy[] = [];
    const rows = 5;
    const cols = 9;
    const spacing = 60;
    const startX = (this.config.canvas.width - (cols * spacing)) / 2;
    const startY = 80;

    for (let row = 0; row < rows; row++) {
      let currentCols = cols;
      let currentStartX = startX;

      // 第一排：2個黃色旗艦
      if (row === 0) {
        currentCols = 2;
        currentStartX = this.config.canvas.width / 2 - (2 * spacing) / 2;
      } else if (row === 1) {
        currentCols = 6;
        currentStartX = this.config.canvas.width / 2 - (6 * spacing) / 2;
      } else if (row === 2) {
        currentCols = 8;
        currentStartX = this.config.canvas.width / 2 - (8 * spacing) / 2;
      } else if (row === 3) {
        currentCols = 10;
        currentStartX = this.config.canvas.width / 2 - (10 * spacing) / 2;
      } else if (row === 4) {
        currentCols = 10;
        currentStartX = this.config.canvas.width / 2 - (10 * spacing) / 2;
      }

      for (let col = 0; col < currentCols; col++) {
        let type: 'red' | 'purple' | 'yellow';
        let points: number;

        if (row === 0) {
          type = 'yellow';
          points = 60;
        } else if (row === 1) {
          type = 'red';
          points = 40;
        } else {
          type = 'purple';
          points = 20;
        }

        const enemyX = currentStartX + col * spacing;
        const enemyY = startY + row * spacing;

        enemies.push({
          position: {
            x: enemyX,
            y: enemyY,
          },
          width: this.config.enemy.width,
          height: this.config.enemy.height,
          type,
          points,
          velocity: { x: 0, y: 0 },
          active: true,
          isDiving: false,
          animationFrame: 0,
          originalPosition: { x: enemyX, y: enemyY },
          isReturning: false,
        });
      }
    }

    return enemies;
  }

  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;

      if (e.key === ' ') {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  public startGame(): void {
    this.state.gameStatus = 'playing';
    this.state.score = 0;
    this.state.level = 1;
    this.state.player = this.createPlayer();
    this.state.enemies = this.createEnemyFormation();
    this.state.playerBullets = [];
    this.state.enemyBullets = [];
    this.state.explosions = [];
    this.audioManager.playGameStart();
  }

  public update(deltaTime: number): void {
    if (this.state.gameStatus === 'levelTransition') {
      this.levelTransitionTimer += deltaTime;
      this.updateStars();
      this.updateExplosions(deltaTime);
      // 在關卡過渡期間也要更新子彈，確保它們能正常移動和消失
      this.updateBullets(deltaTime);

      if (this.levelTransitionTimer >= this.levelTransitionDuration) {
        this.state.gameStatus = 'playing';
        this.levelTransitionTimer = 0;
      }
      return;
    }

    if (this.state.gameStatus !== 'playing') return;

    this.updateStars();
    this.updatePlayer(deltaTime);
    this.updateEnemies(deltaTime);
    this.updateBullets(deltaTime);
    this.updateExplosions(deltaTime);
    this.checkCollisions();
    this.checkLevelComplete();
  }

  private updateStars(): void {
    this.state.stars.forEach((star) => {
      star.position.y += star.speed;

      if (star.position.y > this.config.canvas.height) {
        star.position.y = 0;
        star.position.x = Math.random() * this.config.canvas.width;
      }
    });
  }

  private updatePlayer(deltaTime: number): void {
    const { player } = this.state;

    // 移動
    if (this.keys.ArrowLeft && player.position.x > 0) {
      player.position.x -= this.config.player.speed * deltaTime;
    }
    if (this.keys.ArrowRight && player.position.x < this.config.canvas.width - player.width) {
      player.position.x += this.config.player.speed * deltaTime;
    }

    // 射擊
    if (player.shootCooldown > 0) {
      player.shootCooldown -= deltaTime;
    } else {
      player.canShoot = true;
    }

    if (this.keys[' '] && player.canShoot && this.state.playerBullets.length < 2) {
      this.playerShoot();
      player.canShoot = false;
      player.shootCooldown = this.config.player.shootCooldown;
    }
  }

  private playerShoot(): void {
    const { player } = this.state;

    this.state.playerBullets.push({
      position: {
        x: player.position.x + player.width / 2 - this.config.bullet.width / 2,
        y: player.position.y,
      },
      width: this.config.bullet.width,
      height: this.config.bullet.height,
      velocity: { x: 0, y: -this.config.bullet.speed },
      active: true,
      isPlayerBullet: true,
    });

    // 播放射擊音效
    this.audioManager.playPlayerShoot();
  }

  private updateEnemies(deltaTime: number): void {
    // 檢查是否還有活躍敵人
    const activeEnemiesCount = this.state.enemies.filter((e) => e.active).length;
    if (activeEnemiesCount === 0) {
      return;
    }

    // 更新編隊移動
    const formation = this.state.enemyFormation;
    formation.offsetX += formation.speed * formation.direction * deltaTime;

    // 檢查是否需要改變方向
    let shouldChangeDirection = false;
    this.state.enemies.forEach((enemy) => {
      if (!enemy.active) return;

      if (!enemy.isDiving) {
        const newX = enemy.position.x + formation.offsetX;
        if (newX <= 20 || newX >= this.config.canvas.width - enemy.width - 20) {
          shouldChangeDirection = true;
        }
      }
    });

    if (shouldChangeDirection) {
      formation.direction *= -1;
      formation.offsetX = 0;
    }

    // 更新每個敵人
    this.state.enemies.forEach((enemy, index) => {
      if (!enemy.active) return;

      // 動畫幀
      enemy.animationFrame = (enemy.animationFrame + deltaTime * 0.01) % 1;

      // 編隊移動邏輯
      if (!enemy.isDiving && !enemy.isReturning) {
        // 編隊移動
        enemy.position.x += formation.speed * formation.direction * deltaTime;

        // 隨機俯衝
        if (Math.random() < 0.0005 * this.state.level) {
          enemy.isDiving = true;
          enemy.divePattern = Math.floor(Math.random() * 3);
          enemy.velocity.y = this.config.enemy.diveSpeed;
        }
      }

      // 所有外星人的原始位置都要更新，保持編隊同步
      enemy.originalPosition.x += formation.speed * formation.direction * deltaTime;

      if (enemy.isDiving) {
        // 俯衝移動
        enemy.position.y += enemy.velocity.y * deltaTime;

        // 俯衝模式
        switch (enemy.divePattern) {
          case 0: // 直線俯衝
            break;
          case 1: // 正弦波
            enemy.position.x += Math.sin(enemy.position.y * 0.02) * 2;
            break;
          case 2: // 之字形
            enemy.position.x += Math.sin(enemy.position.y * 0.05) * 4;
            break;
          default:
            break;
        }

        // 到達底部後開始返回，先移動到螢幕上方
        if (enemy.position.y > this.config.canvas.height - 50) {
          enemy.isDiving = false;
          enemy.isReturning = true;

          // 根據外星人的原始Y位置（層級）設置不同的返回延遲和位置
          const layerDelay = (enemy.originalPosition.y - 80) / 60; // 計算是第幾層 (0-4)
          const layerOffset = layerDelay * 50; // 每層增加50像素的偏移
          const randomOffset = Math.random() * 100 + index * 5; // 減少隨機偏移

          enemy.position.x = enemy.originalPosition.x;
          enemy.position.y = -enemy.height - layerOffset - randomOffset;

          // 根據層級調整返回速度，後面的層級返回更快
          const baseSpeed = this.config.enemy.diveSpeed * 0.8;
          enemy.velocity.y = baseSpeed * (0.8 + layerDelay * 0.1);
          enemy.velocity.x = 0;
        }
      } else if (enemy.isReturning) {
        // 從螢幕上方降下到原位
        const nextY = enemy.position.y + enemy.velocity.y * deltaTime;

        // 檢查是否會超過原始位置
        if (nextY >= enemy.originalPosition.y) {
          // 直接設置到原始位置，避免超過
          enemy.position.x = enemy.originalPosition.x;
          enemy.position.y = enemy.originalPosition.y;
          enemy.isReturning = false;
          enemy.velocity.x = 0;
          enemy.velocity.y = 0;
        } else {
          // 繼續向下移動
          enemy.position.y = nextY;

          // 同時水平移動到正確的x位置，確保到達編隊位置
          const targetX = enemy.originalPosition.x;
          const dx = targetX - enemy.position.x;
          if (Math.abs(dx) > 1) {
            enemy.position.x += dx * 0.05; // 加快水平調整速度
          }

          // 檢查是否快要到達原位，如果太接近其他外星人，減慢速度
          const distanceToTarget = Math.abs(enemy.position.y - enemy.originalPosition.y);
          if (distanceToTarget < 80) { // 只在接近目標時才檢查重疊
            const otherEnemies = this.state.enemies.filter(
              (other, otherIndex) => other.active && otherIndex !== index && !other.isReturning
                && Math.abs(other.position.y - enemy.originalPosition.y) < 25, // 只檢查同一層級的外星人
            );

            otherEnemies.forEach((other) => {
              const horizontalDistance = Math.abs(enemy.position.x - other.position.x);
              const verticalDistance = Math.abs(enemy.position.y - other.position.y);

              // 如果水平距離太近且在相似的Y位置，減慢速度
              if (horizontalDistance < 30 && verticalDistance < 15) {
                enemy.velocity.y *= 0.6;
              }
            });
          }
        }
      }

      // 清理離開螢幕太遠的敵人（只在俯衝時檢查）
      if (enemy.isDiving && enemy.position.y > this.config.canvas.height + 200) {
        enemy.active = false;
      }

      // 清理在返回過程中卡住的敵人（更寬鬆的檢查）
      if (enemy.isReturning && enemy.position.y > this.config.canvas.height + 500) {
        enemy.active = false;
      }
    });

    // 敵人射擊 - 只有在有活躍敵人時才射擊
    const activeEnemiesForShooting = this.state.enemies.filter((e) => e.active);
    if (activeEnemiesForShooting.length > 0) {
      const now = Date.now();
      if (now - this.lastEnemyShootTime > this.enemyShootInterval) {
        this.enemyShoot();
        this.lastEnemyShootTime = now;
        this.enemyShootInterval = 500 + Math.random() * 1500;
      }
    }
  }

  private enemyShoot(): void {
    const activeEnemies = this.state.enemies.filter(
      (enemy) => enemy.active,
    );
    if (activeEnemies.length === 0) {
      return;
    }

    const shooter = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];

    this.state.enemyBullets.push({
      position: {
        x: shooter.position.x + shooter.width / 2 - this.config.bullet.width / 2,
        y: shooter.position.y + shooter.height,
      },
      width: this.config.bullet.width,
      height: this.config.bullet.height,
      velocity: { x: 0, y: this.config.bullet.speed * 0.5 },
      active: true,
      isPlayerBullet: false,
    });

    // 播放敵人射擊音效
    this.audioManager.playEnemyShoot();
  }

  private updateBullets(deltaTime: number): void {
    // 更新玩家子彈
    this.state.playerBullets = this.state.playerBullets.filter((bullet) => {
      bullet.position.y += bullet.velocity.y * deltaTime;
      return bullet.active && bullet.position.y > -bullet.height;
    });

    // 更新敵人子彈
    this.state.enemyBullets = this.state.enemyBullets.filter((bullet) => {
      bullet.position.y += bullet.velocity.y * deltaTime;
      return bullet.active && bullet.position.y < this.config.canvas.height;
    });
  }

  private updateExplosions(deltaTime: number): void {
    this.state.explosions = this.state.explosions.filter((explosion) => {
      explosion.currentTime += deltaTime;
      explosion.radius = (explosion.currentTime / explosion.duration)
        * explosion.maxRadius;
      return explosion.currentTime < explosion.duration;
    });
  }

  private checkCollisions(): void {
    // 玩家子彈擊中敵人
    this.state.playerBullets.forEach((bullet) => {
      if (!bullet.active) return;

      this.state.enemies.forEach((enemy) => {
        if (!enemy.active) return;

        if (Game.isColliding(bullet, enemy)) {
          bullet.active = false;
          enemy.active = false;
          this.state.score += enemy.points * (enemy.isDiving ? 2 : 1);

          // 即時更新最高分
          if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            localStorage.setItem('galaxianHighScore', this.state.score.toString());
          }

          this.createExplosion(
            enemy.position.x + enemy.width / 2,
            enemy.position.y + enemy.height / 2,
          );
          // 播放外星人被擊中音效
          this.audioManager.playEnemyHit();
        }
      });
    });

    // 敵人子彈擊中玩家
    this.state.enemyBullets.forEach((bullet) => {
      if (!bullet.active) return;

      if (Game.isColliding(bullet, this.state.player)) {
        bullet.active = false;
        this.state.player.lives--;

        this.createExplosion(
          this.state.player.position.x + this.state.player.width / 2,
          this.state.player.position.y + this.state.player.height / 2,
        );

        // 播放太空人被擊中音效
        this.audioManager.playPlayerHit();

        if (this.state.player.lives <= 0) {
          this.gameOver();
        }
      }
    });

    // 敵人撞擊玩家
    this.state.enemies.forEach((enemy) => {
      if (!enemy.active) return;

      if (Game.isColliding(enemy, this.state.player)) {
        enemy.active = false;
        this.state.player.lives--;

        this.createExplosion(
          enemy.position.x + enemy.width / 2,
          enemy.position.y + enemy.height / 2,
        );

        // 播放太空人被擊中音效
        this.audioManager.playPlayerHit();

        if (this.state.player.lives <= 0) {
          this.gameOver();
        }
      }
    });
  }

  private static isColliding(
    obj1: { position: { x: number; y: number }; width: number; height: number },
    obj2: { position: { x: number; y: number }; width: number; height: number },
  ): boolean {
    return (
      obj1.position.x < obj2.position.x + obj2.width
      && obj1.position.x + obj1.width > obj2.position.x
      && obj1.position.y < obj2.position.y + obj2.height
      && obj1.position.y + obj1.height > obj2.position.y
    );
  }

  private createExplosion(x: number, y: number): void {
    this.state.explosions.push({
      position: { x, y },
      radius: 0,
      maxRadius: 30,
      duration: 300,
      currentTime: 0,
    });

    // 播放爆炸音效
    this.audioManager.playExplosion();
  }

  private checkLevelComplete(): void {
    // 檢查所有敵人是否都被消滅
    const activeEnemies = this.state.enemies.filter((enemy) => enemy.active);

    if (activeEnemies.length === 0) {
      this.state.level++;
      this.state.gameStatus = 'levelTransition';
      this.levelTransitionTimer = 0;

      // 清理所有敵人子彈和玩家子彈
      this.state.enemyBullets = [];
      this.state.playerBullets = [];

      // 重置射擊計時器
      this.lastEnemyShootTime = 0;
      this.enemyShootInterval = 1000;

      // 重置敵人編隊
      this.state.enemyFormation.offsetX = 0;
      this.state.enemyFormation.direction = 1;

      this.state.enemies = this.createEnemyFormation();
      this.state.enemyFormation.speed = this.config.enemy.formationSpeed
        * (1 + this.state.level * 0.1);
      this.audioManager.playLevelComplete();
    }
  }

  private gameOver(): void {
    this.state.gameStatus = 'gameOver';

    // 播放 Game Over 音效
    this.audioManager.playGameOver();

    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      localStorage.setItem('galaxianHighScore', this.state.score.toString());
    }
  }

  public getState(): GameState {
    return this.state;
  }

  public getAudioManager(): AudioManager {
    return this.audioManager;
  }
}
