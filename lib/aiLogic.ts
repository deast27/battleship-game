import { Position, Player } from '@/types';
import { positionToKey, isValidPosition, getRandomEmptyPositions, GRID_SIZE } from './gameLogic';

export class AIPlayer {
  private targets: Position[] = [];
  private huntMode: boolean = false;
  private lastHit: Position | null = null;
  private attemptedShots: Set<string> = new Set();

  getNextShot(aiPlayer: Player, opponentPlayer: Player): Position {
    // Get all valid positions that haven't been attacked yet
    const allValidPositions: Position[] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const pos = { row, col };
        const cellKey = positionToKey(pos);
        // AI can target any cell that hasn't been attacked yet (ship, empty, etc.)
        if (!this.attemptedShots.has(cellKey)) {
          allValidPositions.push(pos);
        }
      }
    }

    if (allValidPositions.length === 0) {
      // This should never happen, but fallback to a random position
      return { row: Math.floor(Math.random() * GRID_SIZE), col: Math.floor(Math.random() * GRID_SIZE) };
    }

    // Hunt mode: target adjacent cells after a hit
    if (this.huntMode && this.lastHit) {
      const adjacentPositions = this.getAdjacentPositions(this.lastHit);
      const validTargets = adjacentPositions.filter(pos => 
        isValidPosition(pos) && 
        !this.attemptedShots.has(positionToKey(pos))
      );

      if (validTargets.length > 0) {
        const selectedTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
        return selectedTarget;
      }
      // If no valid adjacent targets, fall through to random shot
    }

    // Random shot from all valid positions
    const randomPos = allValidPositions[Math.floor(Math.random() * allValidPositions.length)];
    return randomPos || allValidPositions[0]; // Fallback
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
