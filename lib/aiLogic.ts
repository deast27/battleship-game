import { Position, Player, Ship } from '@/types';
import { positionToKey, isValidPosition, getRandomEmptyPositions, GRID_SIZE } from './gameLogic';

export class AIPlayer {
  private targets: Position[] = [];
  private huntMode: boolean = false;
  private lastHit: Position | null = null;
  private attemptedShots: Set<string> = new Set();
  private currentShipHits: Position[] = []; // Track hits on current ship being hunted

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

    // Hunt mode: focus on eliminating the current ship before moving on
    if (this.huntMode && this.currentShipHits.length > 0) {
      // First, try to finish off the current ship by targeting adjacent cells to any hit
      const allAdjacentTargets: Position[] = [];
      
      for (const hitPosition of this.currentShipHits) {
        const adjacentPositions = this.getAdjacentPositions(hitPosition);
        const validTargets = adjacentPositions.filter(pos => 
          isValidPosition(pos) && 
          !this.attemptedShots.has(positionToKey(pos))
        );
        allAdjacentTargets.push(...validTargets);
      }

      // Remove duplicates
      const uniqueTargets = allAdjacentTargets.filter((pos, index, self) => 
        index === self.findIndex(p => positionToKey(p) === positionToKey(pos))
      );

      if (uniqueTargets.length > 0) {
        // Prioritize targets that are most likely to hit the ship (pattern-based)
        const prioritizedTargets = this.prioritizeTargets(uniqueTargets, this.currentShipHits);
        return prioritizedTargets[0];
      }
      
      // If no adjacent targets, the ship might be sunk, so clear current ship tracking
      this.currentShipHits = [];
      this.huntMode = false;
      this.lastHit = null;
    }

    // Random shot from all valid positions
    const randomPos = allValidPositions[Math.floor(Math.random() * allValidPositions.length)];
    return randomPos || allValidPositions[0]; // Fallback
  }

  processShotResult(hit: boolean, position: Position, opponentPlayer: Player, sunkShip: Ship | null): void {
    this.attemptedShots.add(positionToKey(position));

    if (hit) {
      this.huntMode = true;
      this.lastHit = position;
      this.targets.push(position);
      this.currentShipHits.push(position); // Add to current ship being hunted
      
      // Check if this hit sunk a ship
      if (sunkShip) {
        // Ship was sunk, clear current ship tracking and return to standard selection
        this.currentShipHits = [];
        this.huntMode = false;
        this.lastHit = null;
      }
    } else {
      // Only exit hunt mode if we've exhausted all adjacent positions around current ship hits
      if (this.huntMode) {
        // Check if there are any valid adjacent positions around current ship hits
        let hasValidAdjacent = false;
        for (const hitPosition of this.currentShipHits) {
          const adjacentPositions = this.getAdjacentPositions(hitPosition);
          const validTargets = adjacentPositions.filter(pos => 
            isValidPosition(pos) && 
            !this.attemptedShots.has(positionToKey(pos))
          );
          if (validTargets.length > 0) {
            hasValidAdjacent = true;
            break;
          }
        }
        
        // Only exit hunt mode if no valid targets around current ship
        if (!hasValidAdjacent) {
          this.currentShipHits = []; // Clear current ship tracking
          this.huntMode = false;
          this.lastHit = null;
        }
      }
    }
  }

  private prioritizeTargets(targets: Position[], hitPositions: Position[]): Position[] {
    // Group targets by direction from hits to find the most promising pattern
    const targetScores = targets.map(target => {
      let score = 0;
      
      // Score based on how many hits this target is adjacent to
      for (const hit of hitPositions) {
        const distance = Math.abs(target.row - hit.row) + Math.abs(target.col - hit.col);
        if (distance === 1) score += 3; // Directly adjacent
        else if (distance === 2) score += 1; // Two cells away
      }
      
      // Bonus for targets that continue a pattern (horizontal/vertical line)
      const horizontalHits = hitPositions.filter(h => h.row === target.row).length;
      const verticalHits = hitPositions.filter(h => h.col === target.col).length;
      
      if (horizontalHits >= 1) score += horizontalHits * 2;
      if (verticalHits >= 1) score += verticalHits * 2;
      
      return { target, score };
    });
    
    // Sort by score (highest first) and return just the positions
    return targetScores
      .sort((a, b) => b.score - a.score)
      .map(item => item.target);
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
    this.currentShipHits = []; // Clear current ship tracking
    this.attemptedShots.clear();
  }
}
