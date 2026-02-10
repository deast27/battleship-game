import { Ship, ShipType, Position, Grid, Player, ShipConfig, Orientation } from '@/types';

export const SHIP_CONFIGS: ShipConfig[] = [
  { type: 'carrier', size: 5, count: 1 },
  { type: 'battleship', size: 4, count: 1 },
  { type: 'cruiser', size: 3, count: 1 },
  { type: 'submarine', size: 3, count: 1 },
  { type: 'destroyer', size: 2, count: 1 },
];

export const GRID_SIZE = 10;

export function createEmptyGrid(): Grid {
  const grid: Grid = {};
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[`${row}-${col}`] = 'empty';
    }
  }
  return grid;
}

export function positionToKey(position: Position): string {
  return `${position.row}-${position.col}`;
}

export function keyToPosition(key: string): Position {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
}

export function isValidPosition(position: Position): boolean {
  return position.row >= 0 && position.row < GRID_SIZE && 
         position.col >= 0 && position.col < GRID_SIZE;
}

export function getShipPositions(startPos: Position, size: number, orientation: Orientation): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < size; i++) {
    const pos = orientation === 'horizontal' 
      ? { row: startPos.row, col: startPos.col + i }
      : { row: startPos.row + i, col: startPos.col };
    positions.push(pos);
  }
  return positions;
}

export function canPlaceShip(grid: Grid, ship: Ship, startPos: Position, orientation: Orientation): boolean {
  const positions = getShipPositions(startPos, ship.size, orientation);
  
  // Check if all positions are valid and empty
  for (const pos of positions) {
    if (!isValidPosition(pos)) return false;
    if (grid[positionToKey(pos)] !== 'empty') return false;
  }
  
  return true;
}

export function placeShip(grid: Grid, ship: Ship, startPos: Position, orientation: Orientation): Grid {
  const newGrid = { ...grid };
  const positions = getShipPositions(startPos, ship.size, orientation);
  
  for (const pos of positions) {
    newGrid[positionToKey(pos)] = 'ship';
  }
  
  return newGrid;
}

export function createShip(type: ShipType, positions: Position[]): Ship {
  return {
    id: `${type}-${Date.now()}`,
    type,
    size: SHIP_CONFIGS.find(config => config.type === type)!.size,
    positions,
    hits: 0,
    isSunk: false,
  };
}

export function checkHit(player: Player, targetPos: Position): boolean {
  return player.grid[positionToKey(targetPos)] === 'ship';
}

export function processShot(player: Player, targetPos: Position): { hit: boolean; sunkShip: Ship | null } {
  const key = positionToKey(targetPos);
  const wasShip = player.grid[key] === 'ship';
  
  if (wasShip) {
    player.grid[key] = 'hit';
    
    // Find and update the hit ship
    const hitShip = player.ships.find(ship => 
      ship.positions.some(pos => positionToKey(pos) === key)
    );
    
    if (hitShip) {
      hitShip.hits++;
      
      // Check if ship is sunk
      if (hitShip.hits === hitShip.size) {
        hitShip.isSunk = true;
        // Mark all ship positions as sunk
        hitShip.positions.forEach(pos => {
          player.grid[positionToKey(pos)] = 'sunk';
        });
        return { hit: true, sunkShip: hitShip };
      }
    }
    
    return { hit: true, sunkShip: null };
  } else {
    player.grid[key] = 'miss';
    return { hit: false, sunkShip: null };
  }
}

export function isGameOver(player: Player): boolean {
  return player.ships.every(ship => ship.isSunk);
}

export function getRemainingShips(player: Player): number {
  return player.ships.filter(ship => !ship.isSunk).length;
}

export function getRandomEmptyPositions(grid: Grid, count: number): Position[] {
  const emptyPositions: Position[] = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const key = positionToKey({ row, col });
      if (grid[key] === 'empty') {
        emptyPositions.push({ row, col });
      }
    }
  }
  
  // Shuffle and return requested count
  const shuffled = emptyPositions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function placeShipsRandomly(grid: Grid, ships: ShipConfig[]): { grid: Grid; ships: Ship[] } {
  const newGrid = { ...grid };
  const placedShips: Ship[] = [];
  
  for (const shipConfig of ships) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
      const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const startRow = Math.floor(Math.random() * GRID_SIZE);
      const startCol = Math.floor(Math.random() * GRID_SIZE);
      const startPos = { row: startRow, col: startCol };
      
      const positions = getShipPositions(startPos, shipConfig.size, orientation);
      const canPlace = positions.every(pos => isValidPosition(pos) && newGrid[positionToKey(pos)] === 'empty');
      
      if (canPlace) {
        const ship = createShip(shipConfig.type, positions);
        placedShips.push(ship);
        
        positions.forEach(pos => {
          newGrid[positionToKey(pos)] = 'ship';
        });
        
        placed = true;
      }
      
      attempts++;
    }
  }
  
  return { grid: newGrid, ships: placedShips };
}
