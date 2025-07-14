export type Player = 'black' | 'white';

export type CellState = Player | null;

export interface Position {
    row: number;
    col: number;
}

export interface WinLine {
    start: Position;
    end: Position;
}

export interface Move {
    position: Position;
    player: Player;
}

export interface GameState {
    board: CellState[][];
    currentPlayer: Player;
    gameOver: boolean;
    winner: Player | null;
    cursorPosition: Position;
    winLine: WinLine | null;
    moves: Move[];
}

export interface GameConfig {
    boardSize: number;
    winLength: number;
    cellSize: number;
    padding: number;
}

export interface Confetti {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    life: number;
    maxLife: number;
    // 新增属性
    shape: 'square' | 'circle' | 'triangle' | 'star' | 'diamond';
    scale: number;
    opacity: number;
    trail: { x: number; y: number; opacity: number }[];
    windEffect: number;
    bounceCount: number;
    maxBounces: number;
    glowEffect: boolean;
    sparkleEffect: boolean;
    delay: number; // 新增：延遲啟動的幀數
}
