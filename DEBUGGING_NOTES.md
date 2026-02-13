## Bugs Found & Fixed

### Bug 1: Vercel Deployment Error - Missing App Directory
**Error**: `Couldn't find any 'pages' or 'app' directory`
**Cause**: Next.js App Router structure was nested inside `src/app` instead of project root
**Solution**: Moved `app`, `components`, `lib`, and `types` directories to project root level
**Result**: Vercel could successfully detect Next.js project structure

### Bug 2: TypeScript Error - currentPlayer Type Mismatch
**Error**: `Type 'string' is not assignable to type '"player" | "ai"'`
**Location**: `app/page.tsx` around line 156
**Causes**: 
1. Incorrect turn logic - `currentPlayer` set to 'player' after player shot instead of 'ai'
2. Duplicate assignment of `currentPlayer: 'ai'` in same function
3. Missing type assertions for literal types
**Solutions**:
1. Fixed turn logic: After player shoots, `currentPlayer` correctly set to `'ai'`
2. Removed duplicate assignment in `handlePlayerShot` function
3. Added `as const` type assertions for literal type enforcement
4. Fixed import conflict in `Grid.tsx` using `type Grid` import
**Result**: Build compiles successfully with no TypeScript errors


### Bug 3: Tailwind CSS Not Loading in Production
**Error**: "No utility classes were detected" and no CSS styling in deployed app
**Cause**: 
1. Tailwind config still pointing to `src/` directories after moving files to root
2. BattlePhase component using placeholder divs instead of actual Grid component
**Solutions**:
1. Updated `tailwind.config.js` content paths from `./src/**/*` to `./**/*`
2. Replaced placeholder divs in BattlePhase with actual Grid component
3. Added proper Grid import to BattlePhase component
4. Added click handlers for AI grid interaction
**Result**: Tailwind CSS now processes correctly and Grid renders as proper 10x10 with colors

### Bug 4: AI Getting Stuck After First Attack
**Error**: AI would stop making moves after first attack or get stuck in hunt mode
**Causes**:
1. AI was targeting its own grid instead of opponent's grid
2. Hunt mode logic exited too early, missing valid adjacent targets
3. Poor fallback logic when no available positions found
4. Turn management issues - AI turn not triggering properly after player hits
**Solutions**:
1. Fixed `getNextShot` to target `opponentPlayer.grid` instead of `aiPlayer.grid`
2. Improved hunt mode persistence - only exit when ALL adjacent positions around ALL hits are exhausted
3. Enhanced fallback logic with better empty cell detection
4. Added safety checks to prevent undefined returns
5. Added automatic AI turn triggering with useEffect instead of manual setTimeout
6. Removed conflicting manual AI turn triggers that caused timing issues
**Result**: AI now intelligently hunts ships and continues making moves throughout the game

### Bug 5: Grid Row Number Alignment
**Error**: Row numbers (1-10) were misaligned, appearing 1.5 rows above grid
**Location**: `components/Grid.tsx` row labels positioning
**Cause**: Absolute positioning with `top-0` didn't account for header spacing
**Solution**: Changed from `top-0` to `top-2` and added `relative` to main container
**Result**: Row numbers now align correctly with grid rows

### Bug 6: Hit/Miss Positioning and AI Verification
**Error**: Hit/miss display appeared in screen center instead of above target square; AI hitting capability questioned
**Cause**: No tracking of exact shot positions for display positioning
**Solutions**:
1. Added `lastShotPosition` state to track exact coordinates of each shot
2. Implemented `getResultPosition()` function to calculate position above specific target square
3. Updated shot result display to use calculated positioning instead of fixed center
4. Verified AI logic can hit ships (processShot function works correctly)
5. Added position tracking for both player and AI turns
**Result**: Hit/miss messages now appear above the actual square that was attacked

### Bug 7: AI Targeting Logic Error
**Error**: AI was not hitting player ships - targeting empty cells instead of ship cells
**Location**: `lib/aiLogic.ts` `getNextShot` function
**Cause**: AI was filtering for empty cells instead of ship cells
**Original Code**: `if (opponentPlayer.grid[cellKey] === 'empty' && !this.attemptedShots.has(cellKey))`
**Fixed Code**: `if (opponentPlayer.grid[cellKey] === 'ship' && !this.attemptedShots.has(cellKey))`
**Result**: AI now correctly targets ship cells and can hit player ships

### Bug 8: Hit/Miss Icons Not Appearing on Consecutive Same-Result Attacks
**Error**: Hit/Miss icons would not appear when consecutive attacks had the same outcome (hit after hit, miss after miss)
**Location**: `components/BattlePhase.tsx` useEffect dependency array
**Cause**: useEffect only depended on `lastShotResult`, so React wouldn't re-trigger the effect if the result was the same as the previous attack
**Original Code**: `}, [lastShotResult]);`
**Fixed Code**: `}, [lastShotResult, lastShotPosition]); // Add lastShotPosition to trigger on every attack`
**Solution**: Added `lastShotPosition` to the dependency array so the effect triggers on every attack regardless of outcome
**Result**: Hit/Miss icons now appear after every single attack by both player and AI

### Bug 9: Initial "Miss!" Notification Appearing When Starting Battle
**Error**: A "Miss!" notification would appear immediately after clicking "Start Battle" before any attacks were made
**Location**: `app/page.tsx` `handleStartGame` function
**Cause**: The `lastShotResult` and `lastShotPosition` state variables were not being cleared when transitioning from ship placement to battle phase
**Solution**: Added `setLastShotResult(null)` and `setLastShotPosition(null)` to both `handleStartGame` and `handleReset` functions
**Code Added**:
```typescript
// Clear any previous shot results
setLastShotResult(null);
setLastShotPosition(null);
```
**Result**: No notification appears when starting battle - only after actual attacks are made

### Bug 10: Drag and Drop Positioning Not Respecting Grabbed Cell
**Error**: When dragging a ship by any cell other than the origin, the ship would be placed as if grabbed from the origin cell
**Location**: `app/page.tsx` `handleShipDrop` function
**Cause**: The drag and drop logic always used the drop position as the ship's origin, regardless of which cell was actually grabbed
**Solution**: 
1. Added `draggedShipCellIndex` state to track which ship cell was grabbed
2. Updated `handleShipDragStart` to find and store the index of the grabbed cell
3. Modified `handleShipDrop` to calculate the correct placement offset:
   ```typescript
   // Calculate the offset needed to place the ship so the grabbed cell ends up at the drop position
   const grabbedCell = draggedShip.positions[draggedShipCellIndex];
   const shipOrigin = draggedShip.positions[0];
   
   // Calculate the offset from ship origin to grabbed cell
   const rowOffset = grabbedCell.row - shipOrigin.row;
   const colOffset = grabbedCell.col - shipOrigin.col;
   
   // Calculate the new ship origin position
   const newOrigin = {
     row: position.row - rowOffset,
     col: position.col - colOffset
   };
   ```
**Result**: Ships now correctly position based on which cell was grabbed - if you grab the 3rd cell, that cell will be placed at the drop location

### Bug 11: Initial "Miss!" Notification Appearing When Starting Battle
**Error**: A "Miss!" notification would appear immediately after clicking "Start Battle" before any attacks were made
**Location**: `app/page.tsx` `handleStartGame` function
**Cause**: The `lastShotResult` and `lastShotPosition` state variables were not being cleared when transitioning from ship placement to battle phase
**Solution**: Added `setLastShotResult(null)` and `setLastShotPosition(null)` to both `handleStartGame` and `handleReset` functions
**Code Added**:
```typescript
// Clear any previous shot results
setLastShotResult(null);
setLastShotPosition(null);
```
**Result**: No notification appears when starting battle - only after actual attacks are made

### Bug 12: Hit/Miss Icons Not Appearing on Consecutive Same-Result Attacks
**Error**: Hit/Miss icons would not appear when consecutive attacks had the same outcome (hit after hit, miss after miss)
**Location**: `components/BattlePhase.tsx` useEffect dependency array
**Cause**: useEffect only depended on `lastShotResult`, so React wouldn't re-trigger the effect if the result was the same as the previous attack
**Original Code**: `}, [lastShotResult]);`
**Fixed Code**: `}, [lastShotResult, lastShotPosition]); // Add lastShotPosition to trigger on every attack`
**Solution**: Added `lastShotPosition` to the dependency array so the effect triggers on every attack regardless of outcome
**Result**: Hit/Miss icons now appear after every single attack by both player and AI

### Bug 13: Drag and Drop Positioning Not Respecting Grabbed Cell
**Error**: When dragging a ship by any cell other than the origin, the ship would be placed as if grabbed from the origin cell
**Location**: `app/page.tsx` `handleShipDrop` function
**Cause**: The drag and drop logic always used the drop position as the ship's origin, regardless of which cell was actually grabbed
**Solution**: 
1. Added `draggedShipCellIndex` state to track which ship cell was grabbed
2. Updated `handleShipDragStart` to find and store the index of the grabbed cell
3. Modified `handleShipDrop` to calculate the correct placement offset:
   ```typescript
   // Calculate the offset needed to place the ship so the grabbed cell ends up at the drop position
   const grabbedCell = draggedShip.positions[draggedShipCellIndex];
   const shipOrigin = draggedShip.positions[0];
   
   // Calculate the offset from ship origin to grabbed cell
   const rowOffset = grabbedCell.row - shipOrigin.row;
   const colOffset = grabbedCell.col - shipOrigin.col;
   
   // Calculate the new ship origin position
   const newOrigin = {
     row: position.row - rowOffset,
     col: position.col - colOffset
   };
   ```
**Result**: Ships now correctly position based on which cell was grabbed - if you grab the 3rd cell, that cell will be placed at the drop location

### Bug 14: Already Attacked Cells Still Clickable
**Error**: Players could click on cells that had already been attacked (hit, miss, or sunk) and attempt to attack them again
**Location**: `components/Grid.tsx` cell click handler
**Cause**: The click handler didn't check if a cell had already been attacked before allowing the click
**Solution**: 
1. Added `isAttacked` check in `getCellClass` to change cursor to 'not-allowed' for attacked cells
2. Created `handleCellClickWithCheck` function to prevent clicks on already attacked cells:
   ```typescript
   const handleCellClickWithCheck = (row: number, col: number, cellState: CellState) => {
     // Prevent clicks on already attacked cells
     const isAttacked = cellState === 'hit' || cellState === 'miss' || cellState === 'sunk';
     if (!isAttacked && onCellClick) {
       onCellClick({ row, col });
     }
   };
   ```
3. Updated grid cells to use the new click handler with cell state check
**Result**: Already attacked cells now show a 'not-allowed' cursor and cannot be clicked for the rest of the game

### Bug 15: Drag and Drop Orientation Not Preserved
**Error**: When dragging a vertically placed ship to a new position, it would revert to horizontal orientation
**Location**: `app/page.tsx` `handleShipDrop` function
**Cause**: The drag and drop logic was using the global `gameState.shipOrientation` instead of the ship's actual current orientation
**Solution**: 
1. Added `getShipOrientation` helper function to determine ship orientation from its positions:
   ```typescript
   const getShipOrientation = (positions: Position[]): Orientation => {
     if (positions.length < 2) return 'horizontal';
     const first = positions[0];
     const second = positions[1];
     return first.row === second.row ? 'horizontal' : 'vertical';
   };
   ```
2. Updated `handleShipDrop` to use the ship's current orientation:
   ```typescript
   // Determine the ship's current orientation from its positions
   const shipOrientation = getShipOrientation(draggedShip.positions);
   // Try to place ship at the calculated origin position with its current orientation
   const canPlace = canPlaceShip(player.grid, { size: shipSize } as any, newOrigin, shipOrientation);
   ```
**Result**: Ships now maintain their original orientation when dragged and dropped to new positions

### Bug 16: AI Hunt Mode Not Focused on Ship Elimination
**Error**: AI would leave a ship after a few hits and not finish knocking it out, jumping between different ships instead of systematically eliminating one at a time
**Location**: `lib/aiLogic.ts` AI hunt mode logic
**Cause**: AI was tracking all hits globally instead of focusing on individual ships, and would exit hunt mode too early
**Solution**: 
1. Added `currentShipHits` array to track hits on the specific ship being hunted
2. Enhanced hunt mode to focus on adjacent cells around current ship hits:
   ```typescript
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
   ```
3. Added `prioritizeTargets()` method for intelligent target selection based on proximity and patterns
4. Only exit hunt mode when all adjacent cells around current ship are exhausted
**Result**: AI now systematically sinks ships one by one instead of jumping between different ships

### Bug 17: User Can Attack During AI Turn
**Error**: Users could click on enemy grid cells and attack even while the AI was still processing its move
**Location**: `app/page.tsx` player shot handler and BattlePhase component
**Cause**: No mechanism to prevent user attacks during AI's thinking/processing time
**Solution**: 
1. Added `isAIThinking` state to track when AI is processing its move:
   ```typescript
   const [isAIThinking, setIsAIThinking] = useState(false);
   ```
2. Updated AI turn logic to set thinking state:
   ```typescript
   setIsAIThinking(true); // Start AI thinking
   const timer = setTimeout(() => {
     handleAITurn();
     setIsAIThinking(false); // End AI thinking
   }, 1500);
   ```
3. Blocked player shots during AI thinking:
   ```typescript
   const handlePlayerShot = (position: Position) => {
     if (gameState.phase !== 'battle' || gameState.currentPlayer !== 'player' || gameState.winner || isAIThinking) return;
     if (gameState.phase !== 'battle' || gameState.currentPlayer !== 'player' || gameState.winner || isAIThinking || position.row < 0 || position.row >= 10 || position.col < 0 || position.col >= 10) return;
   ```
4. Updated BattlePhase to disable grid clicks when AI is thinking
**Result**: Users can only attack during their turn and must wait for AI to complete its move before attacking again

### Bug 18: AI Not Making Move After Player's First Turn
**Error**: AI would not make a move after the player's first turn, getting stuck and not triggering its turn
**Location**: `app/page.tsx` useEffect for AI turn triggering
**Cause**: Circular dependency in useEffect dependency array - it included `isAIThinking` which is set by the AI turn logic, causing the effect to potentially not trigger properly
**Solution**: Removed `isAIThinking` from the useEffect dependency array to eliminate circular dependency:
   ```typescript
   // Before (problematic):
   }, [gameState.currentPlayer, gameState.phase, gameState.winner, isAIThinking]);
   
   // After (fixed):
   }, [gameState.currentPlayer, gameState.phase, gameState.winner]);
   ```
**Result**: AI turn now triggers properly when it becomes the AI's turn, without circular dependency issues

### Bug 19: AI Continues Hunt Mode After Sinking Ship
**Error**: AI would continue focusing on attacking squares around a ship even after it was sunk, instead of returning to standard random selection
**Location**: `lib/aiLogic.ts` AI hunt mode logic
**Cause**: AI wasn't detecting when it had sunk a ship, so it would remain in hunt mode and continue targeting the area around the sunk ship
**Solution**: 
1. Enhanced `processShotResult` method to accept `sunkShip` parameter:
   ```typescript
   processShotResult(hit: boolean, position: Position, opponentPlayer: Player, sunkShip: Ship | null): void
   ```
2. Added ship sinking detection and immediate hunt mode reset:
   ```typescript
   // Check if this hit sunk a ship
   if (sunkShip) {
     // Ship was sunk, clear current ship tracking and return to standard selection
     this.currentShipHits = [];
     this.huntMode = false;
     this.lastHit = null;
   }
   ```
3. Updated AI turn handler to pass sunk ship information from `processShot` function
4. Added `Ship` type import to `aiLogic.ts`
**Result**: AI now properly exits hunt mode immediately after sinking a ship and returns to standard random selection until it hits another ship

### Bug 20: Ship Image Rotation and Rendering Issues
**Error**: Ship images were blurry, distorted, or not rotating correctly when placed in different orientations
**Location**: `components/ShipIcons.tsx` and `components/Grid.tsx`
**Causes**:
1. Initial attempt to use CSS transforms (`rotate(90deg)`) caused blur and distortion
2. Multiple CSS rendering properties (`crisp-edges`, `pixelated`, etc.) didn't resolve the blur
3. Grid component was calculating ship orientation correctly but not passing the `orientation` prop to ShipIcon components
4. All ships were receiving `orientation: 'horizontal'` regardless of actual placement
**Solutions**:
1. **Abandoned CSS rotation approach**: Stopped trying to rotate images with CSS transforms
2. **Implemented separate PNG files**: Created orientation-specific image files:
   - `{ship}-horizontal.png` for left-to-right placement
   - `{ship}-vertical.png` for top-to-bottom placement
3. **Fixed prop passing**: Added `orientation={orientation}` to IconComponent in Grid.tsx ship overlay rendering:
   ```typescript
   <IconComponent 
     size={orientation === 'horizontal' ? ship.size * 32 : ship.size * 32}
     orientation={orientation}  // This was missing!
     className={`w-full h-full`}
   />
   ```
4. **Clean image loading**: Updated ShipIcons.tsx to load correct image based on orientation:
   ```typescript
   const imageSrc = orientation === 'horizontal' ? '/ships/carrier-horizontal.png' : '/ships/carrier-vertical.png';
   ```
5. **Removed all CSS transforms**: Eliminated rotation, scaling, and rendering optimization CSS
**Debugging Process**:
1. Added console logs to track orientation values and image loading
2. Discovered all ships were receiving `orientation: 'horizontal'`
3. Identified missing `orientation` prop in Grid component
4. Fixed prop passing and verified correct image loading
**Result**: Ships now display crisp, properly oriented images without any blur or distortion. Horizontal ships face left-to-right, vertical ships face top-to-bottom, using pre-rotated PNG files.