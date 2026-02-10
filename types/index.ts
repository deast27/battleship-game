export type ShipType = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

export type Orientation = 'horizontal' | 'vertical';

export type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'sunk';

export interface Ship {
  id: string;
  type: ShipType;
  size: number;
  positions: Position[];
  hits: number;
  isSunk: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Grid {
  [key: string]: CellState;
}

export interface Player {
  id: string;
  name: string;
  grid: Grid;
  ships: Ship[];
  shots: Position[];
}

export type GamePhase = 'placement' | 'battle' | 'gameOver';

export interface GameState {
  phase: GamePhase;
  currentPlayer: 'player' | 'ai';
  player: Player;
  ai: Player;
  winner: 'player' | 'ai' | null;
  selectedShip: ShipType | null;
  shipOrientation: Orientation;
  lastHit: Position | null;
  aiTargets: Position[];
  aiHuntMode: boolean;
}

export interface ShipConfig {
  type: ShipType;
  size: number;
  count: number;
}
