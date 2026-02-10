import { Position, Player } from '@/types';
import { positionToKey, isValidPosition, getRandomEmptyPositions, GRID_SIZE } from './gameLogic';

export class AIPlayer {
  private targets: Position[] = [];
  private huntMode: boolean = false;
  private lastHit: Position | null = null;
  private attemptedShots: Set<string> = new Set();

  getNextShot(aiPlayer: Player, opponentPlayer: Player): Position {
    // Get available positions from opponent's grid (where we're shooting)
    const availablePositions = getRandomEmptyPositions(opponentPlayer.grid, 100)
      .filter(pos => !this.attemptedShots.has(positionToKey(pos)));

    if (availablePositions.length === 0) {
      // Fallback to any empty position on opponent's grid
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const pos = { row, col };
          const cellKey = positionToKey(pos);
          if (opponentPlayer.grid[cellKey] === 'empty' && 
              !this.attemptedShots.has(cellKey)) {
            return pos;
          }
        }
      }
    }

    // Hunt mode: target adjacent cells after a hit
    if (this.huntMode && this.lastHit) {
      const adjacentPositions = this.getAdjacentPositions(this.lastHit);
      const validTargets = adjacentPositions.filter(pos => 
        isValidPosition(pos) && 
        !this.attemptedShots.has(positionToKey(pos))
      );

      if (validTargets.length > 0) {
        return validTargets[Math.floor(Math.random() * validTargets.length)];
      }
      // If no valid adjacent targets, fall through to random shot
    }

    // Random shot from available positions
    const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    return randomPos || availablePositions[0]; // Fallback
  }

  processShotResult(hit: boolean, position: Position): void {
    this.attemptedShots.add(positionToKey(position));

    if (hit) {
      this.huntMode = true;
      this.lastHit = position;
      this.targets.push(position);
    } else {
      // Only exit hunt mode if we've exhausted all adjacent positions around ALL recent hits
      if (this.huntMode) {
        // Check if there are any valid adjacent positions around any of our hit targets
        let hasValidAdjacent = false;
        for (const target of this.targets) {
          const adjacentPositions = this.getAdjacentPositions(target);
          const validTargets = adjacentPositions.filter(pos => 
            isValidPosition(pos) && 
            !this.attemptedShots.has(positionToKey(pos))
          );
          if (validTargets.length > 0) {
            hasValidAdjacent = true;
            break;
          }
        }
        
        // Only exit hunt mode if no valid targets around any hit
        if (!hasValidAdjacent) {
          this.huntMode = false;
          this.lastHit = null;
        }
      }
    }
  }

  private getAdjacentPositions(position: Position): Position[] {
    return [
      { row: position.row - 1, col: position.col }, // up
      { row: position.row + 1, col: position.col }, // down
      { row: position.row, col: position.col - 1 }, // left
      { row: position.row, col: position.col + 1 }, // right
    ];
  }

  reset(): void {
    this.targets = [];
    this.huntMode = false;
    this.lastHit = null;
    this.attemptedShots.clear();
  }
}
