export interface Position {
    x: number;
    y: number;
}

export interface Velocity {
    x: number;
    y: number;
}

export interface GameObject {
    position: Position;
    width: number;
    height: number;
    active: boolean;
}

export interface Player extends GameObject {
    lives: number;
    canShoot: boolean;
    shootCooldown: number;
}

export interface Enemy extends GameObject {
    type: 'red' | 'purple' | 'yellow';
    points: number;
    velocity: Velocity;
    isDiving: boolean;
    divePattern?: number;
    animationFrame: number;
    originalPosition: Position;
    isReturning: boolean;
}

export interface Bullet extends GameObject {
    velocity: Velocity;
    isPlayerBullet: boolean;
}

export interface Explosion {
    position: Position;
    radius: number;
    maxRadius: number;
    duration: number;
    currentTime: number;
}

export interface Star {
    position: Position;
    speed: number;
    brightness: number;
}

export interface GameState {
    player: Player;
    enemies: Enemy[];
    playerBullets: Bullet[];
    enemyBullets: Bullet[];
    explosions: Explosion[];
    stars: Star[];
    score: number;
    highScore: number;
    level: number;
    gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver' | 'levelTransition';
    enemyFormation: {
        offsetX: number;
        direction: 1 | -1;
        speed: number;
    };
}

export interface GameConfig {
    canvas: {
        width: number;
        height: number;
    };
    player: {
        speed: number;
        width: number;
        height: number;
        shootCooldown: number;
    };
    enemy: {
        width: number;
        height: number;
        formationSpeed: number;
        diveSpeed: number;
        shootChance: number;
    };
    bullet: {
        speed: number;
        width: number;
        height: number;
    };
}
