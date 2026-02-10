import { Position, Player } from '@/types';
import { positionToKey, isValidPosition, getRandomEmptyPositions, GRID_SIZE } from './gameLogic';

export class AIPlayer {
  private targets: Position[] = [];
  private huntMode: boolean = false;
  private lastHit: Position | null = null;
  private attemptedShots: Set<string> = new Set();

  getNextShot(aiPlayer: Player, opponentPlayer: Player): Position {
    const availablePositions = getRandomEmptyPositions(aiPlayer.grid, 100)
      .filter(pos => !this.attemptedShots.has(positionToKey(pos)));

    if (availablePositions.length === 0) {
      // Fallback to any empty position
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const pos = { row, col };
          if (!this.attemptedShots.has(positionToKey(pos))) {
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
    }

    // Random shot
    const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    return randomPos;
  }

  processShotResult(hit: boolean, position: Position): void {
    this.attemptedShots.add(positionToKey(position));

    if (hit) {
      this.huntMode = true;
      this.lastHit = position;
      this.targets.push(position);
    } else {
      // If we've exhausted all adjacent positions in hunt mode, exit it
      if (this.huntMode && this.lastHit) {
        const adjacentPositions = this.getAdjacentPositions(this.lastHit);
        const allAttempted = adjacentPositions.every(pos => 
          this.attemptedShots.has(positionToKey(pos))
        );
        
        if (allAttempted) {
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
