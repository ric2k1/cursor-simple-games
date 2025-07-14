import { CellState, Position, GameState, GameConfig, WinLine, Move } from './types';

export class GomokuGame {
    private config: GameConfig;
    private state: GameState;

    constructor(config: GameConfig) {
        this.config = config;
        this.state = this.createInitialState();
    }

    private createInitialState(): GameState {
        const board: CellState[][] = [];
        for (let i = 0; i < this.config.boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < this.config.boardSize; j++) {
                board[i][j] = null;
            }
        }

        return {
            board,
            currentPlayer: 'black',
            gameOver: false,
            winner: null,
            cursorPosition: { row: 0, col: 0 },
            winLine: null,
            moves: []
        };
    }

    public getState(): GameState {
        return { ...this.state };
    }

    public getConfig(): GameConfig {
        return { ...this.config };
    }

    public makeMove(position: Position): boolean {
        if (this.state.gameOver) {
            return false;
        }

        const { row, col } = position;
        
        if (row < 0 || row >= this.config.boardSize || 
            col < 0 || col >= this.config.boardSize) {
            return false;
        }

        if (this.state.board[row][col] !== null) {
            return false;
        }

        // 記錄這一步
        const move: Move = {
            position: { ...position },
            player: this.state.currentPlayer
        };
        this.state.moves.push(move);

        this.state.board[row][col] = this.state.currentPlayer;

        const winLine = this.checkWin(position);
        if (winLine) {
            this.state.gameOver = true;
            this.state.winner = this.state.currentPlayer;
            this.state.winLine = winLine;
        } else if (this.isBoardFull()) {
            this.state.gameOver = true;
        } else {
            this.state.currentPlayer = this.state.currentPlayer === 'black' ? 'white' : 'black';
        }

        return true;
    }

    public moveCursor(direction: 'up' | 'down' | 'left' | 'right'): void {
        const { row, col } = this.state.cursorPosition;
        
        switch (direction) {
            case 'up':
                if (row > 0) this.state.cursorPosition.row = row - 1;
                break;
            case 'down':
                if (row < this.config.boardSize - 1) this.state.cursorPosition.row = row + 1;
                break;
            case 'left':
                if (col > 0) this.state.cursorPosition.col = col - 1;
                break;
            case 'right':
                if (col < this.config.boardSize - 1) this.state.cursorPosition.col = col + 1;
                break;
        }
    }

    public setCursorPosition(position: Position): void {
        if (position.row >= 0 && position.row < this.config.boardSize &&
            position.col >= 0 && position.col < this.config.boardSize) {
            this.state.cursorPosition = { ...position };
        }
    }

    public restart(): void {
        this.state = this.createInitialState();
    }

    public undo(): boolean {
        if (this.state.gameOver || this.state.moves.length === 0) {
            return false;
        }

        // 移除最後一步
        const lastMove = this.state.moves.pop()!;
        const { row, col } = lastMove.position;
        
        // 清除棋盤上的棋子
        this.state.board[row][col] = null;
        
        // 切換回上一個玩家
        this.state.currentPlayer = lastMove.player;
        
        // 重置遊戲狀態
        this.state.gameOver = false;
        this.state.winner = null;
        this.state.winLine = null;

        return true;
    }

    private checkWin(position: Position): WinLine | null {
        const { row, col } = position;
        const player = this.state.board[row][col];
        if (!player) return null;

        const directions = [
            { dr: 0, dc: 1 },   // 水平
            { dr: 1, dc: 0 },   // 垂直
            { dr: 1, dc: 1 },   // 對角線
            { dr: 1, dc: -1 }   // 反對角線
        ];

        for (const { dr, dc } of directions) {
            let count = 1;
            let startRow = row, startCol = col;
            let endRow = row, endCol = col;

            // 正向檢查
            for (let i = 1; i < this.config.winLength; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (newRow < 0 || newRow >= this.config.boardSize ||
                    newCol < 0 || newCol >= this.config.boardSize ||
                    this.state.board[newRow][newCol] !== player) {
                    break;
                }
                count++;
                endRow = newRow;
                endCol = newCol;
            }

            // 反向檢查
            for (let i = 1; i < this.config.winLength; i++) {
                const newRow = row - dr * i;
                const newCol = col - dc * i;
                
                if (newRow < 0 || newRow >= this.config.boardSize ||
                    newCol < 0 || newCol >= this.config.boardSize ||
                    this.state.board[newRow][newCol] !== player) {
                    break;
                }
                count++;
                startRow = newRow;
                startCol = newCol;
            }

            if (count >= this.config.winLength) {
                return {
                    start: { row: startRow, col: startCol },
                    end: { row: endRow, col: endCol }
                };
            }
        }

        return null;
    }

    private isBoardFull(): boolean {
        for (let row = 0; row < this.config.boardSize; row++) {
            for (let col = 0; col < this.config.boardSize; col++) {
                if (this.state.board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }
} 