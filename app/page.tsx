'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameState, ShipType, Orientation, Position, Player } from '@/types';
import { 
  createEmptyGrid, 
  createShip, 
  placeShip, 
  canPlaceShip, 
  processShot, 
  isGameOver,
  placeShipsRandomly,
  SHIP_CONFIGS
} from '@/lib/gameLogic';
import { AIPlayer } from '@/lib/aiLogic';
import ShipPlacement from '@/components/ShipPlacement';
import BattlePhase from '@/components/BattlePhase';
import Grid from '@/components/Grid';
import DarkModeToggle from '@/components/DarkModeToggle';

const BattleshipGame: React.FC = () => {
  const initializeGameState = (): GameState => ({
    phase: 'placement',
    currentPlayer: 'player',
    player: {
      id: 'player',
      name: 'Player',
      grid: createEmptyGrid(),
      ships: [],
      shots: []
    },
    ai: {
      id: 'ai',
      name: 'AI',
      grid: createEmptyGrid(),
      ships: [],
      shots: []
    },
    winner: null,
    selectedShip: null,
    shipOrientation: 'horizontal',
    lastHit: null,
    aiTargets: [],
    aiHuntMode: false
  });

  const [gameState, setGameState] = useState<GameState>(initializeGameState);
  const [aiPlayer] = useState(() => new AIPlayer());
  const [lastShotResult, setLastShotResult] = useState<'hit' | 'miss' | null>(null);
  const [lastShotPosition, setLastShotPosition] = useState<Position | null>(null);

  // Auto-trigger AI turn when it's AI's turn
  useEffect(() => {
    if (gameState.phase === 'battle' && gameState.currentPlayer === 'ai' && !gameState.winner) {
      const timer = setTimeout(() => {
        handleAITurn();
      }, 1500); // Give AI thinking time
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.phase, gameState.winner]);

  // Handle ship selection
  const handleShipSelect = (shipType: ShipType) => {
    setGameState(prev => ({ ...prev, selectedShip: shipType }));
  };

  // Toggle ship orientation
  const handleOrientationToggle = () => {
    setGameState(prev => ({
      ...prev,
      shipOrientation: prev.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal'
    }));
  };

  // Place ship on grid
  const handlePlaceShip = (position: Position) => {
    if (!gameState.selectedShip) return;

    const { player } = gameState;
    const shipConfig = SHIP_CONFIGS.find(config => config.type === gameState.selectedShip);
    if (!shipConfig) return;

    // Check if ship can be placed
    if (!canPlaceShip(player.grid, { size: shipConfig.size } as any, position, gameState.shipOrientation)) {
      return;
    }

    // Create and place the ship
    const positions = Array.from({ length: shipConfig.size }, (_, i) => 
      gameState.shipOrientation === 'horizontal'
        ? { row: position.row, col: position.col + i }
        : { row: position.row + i, col: position.col }
    );

    const newShip = createShip(gameState.selectedShip, positions);
    const updatedGrid = placeShip(player.grid, newShip, position, gameState.shipOrientation);

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        grid: updatedGrid,
        ships: [...prev.player.ships, newShip]
      },
      selectedShip: null
    }));
  };

  // Random ship placement
  const handleRandomPlacement = () => {
    const { grid, ships } = placeShipsRandomly(createEmptyGrid(), SHIP_CONFIGS);
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        grid,
        ships
      }
    }));
  };

  // Reset game
  const handleReset = () => {
    setGameState(initializeGameState());
    aiPlayer.reset();
    setLastShotResult(null);
    setLastShotPosition(null);
  };

  // Start battle phase
  const handleStartGame = () => {
    // Place AI ships randomly
    const { grid: aiGrid, ships: aiShips } = placeShipsRandomly(createEmptyGrid(), SHIP_CONFIGS);
    
    // Clear any previous shot results
    setLastShotResult(null);
    setLastShotPosition(null);
    
    setGameState(prev => ({
      ...prev,
      phase: 'battle',
      ai: {
        ...prev.ai,
        grid: aiGrid,
        ships: aiShips
      }
    }));
  };

  // Handle player shot
  const handlePlayerShot = (position: Position) => {
    if (gameState.phase !== 'battle' || gameState.currentPlayer !== 'player' || gameState.winner) return;

    const { ai } = gameState;
    const { hit, sunkShip } = processShot(ai, position);

    // Set shot result and position for display
    setLastShotResult(hit ? 'hit' : 'miss');
    setLastShotPosition(position);

    const newGameState = {
      ...gameState,
      ai: {
        ...ai,
        shots: [...ai.shots, position]
      },
      currentPlayer: 'ai' as const
    };

    // Check for game over
    if (isGameOver(ai)) {
      newGameState.winner = 'player';
      newGameState.phase = 'gameOver';
    } else {
      // Switch to AI turn is already handled above
    }

    setGameState(newGameState);

    // AI turn will be triggered automatically by useEffect when currentPlayer is 'ai'
  };

  // AI turn
  const handleAITurn = useCallback(() => {
    if (gameState.phase !== 'battle' || gameState.currentPlayer !== 'ai' || gameState.winner) return;

    const { player, ai } = gameState;
    const shotPosition = aiPlayer.getNextShot(ai, player);
    const { hit, sunkShip } = processShot(player, shotPosition);

    // Set shot result and position for display
    setLastShotResult(hit ? 'hit' : 'miss');
    setLastShotPosition(shotPosition);

    aiPlayer.processShotResult(hit, shotPosition);

    const newGameState = {
      ...gameState,
      player: {
        ...player,
        shots: [...player.shots, shotPosition]
      },
      currentPlayer: 'player' as const
    };

    // Check for game over
    if (isGameOver(player)) {
      newGameState.winner = 'ai';
      newGameState.phase = 'gameOver';
    }

    setGameState(newGameState);
  }, [gameState, aiPlayer]);

  // Handle new game
  const handleNewGame = () => {
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <DarkModeToggle />
          </div>
          <h1 className="text-4xl font-bold text-ocean-800 dark:text-ocean-200 mb-2">⚓ Battleship</h1>
          <p className="text-ocean-600 dark:text-ocean-300">Classic Naval Combat Game</p>
        </header>

        <main>
          {gameState.phase === 'placement' && (
            <div className="space-y-8">
              <ShipPlacement
                ships={gameState.player.ships}
                selectedShip={gameState.selectedShip}
                orientation={gameState.shipOrientation}
                onShipSelect={handleShipSelect}
                onOrientationToggle={handleOrientationToggle}
                onPlaceShip={handlePlaceShip}
                onRandomPlacement={handleRandomPlacement}
                onReset={handleReset}
                onStartGame={handleStartGame}
                grid={gameState.player.grid}
              />
              
              {/* Player Grid Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <h3 className="text-lg font-semibold text-ocean-700 mb-4 text-center">
                    Your Fleet
                  </h3>
                  <Grid
                    grid={gameState.player.grid}
                    onCellClick={gameState.selectedShip ? handlePlaceShip : undefined}
                    showShips={true}
                    isOpponent={false}
                  />
                </div>
              </div>
            </div>
          )}

          {gameState.phase === 'battle' && (
            <BattlePhase
              player={gameState.player}
              ai={gameState.ai}
              currentPlayer={gameState.currentPlayer}
              onPlayerShot={handlePlayerShot}
              onNewGame={handleNewGame}
              winner={gameState.winner}
              lastShotResult={lastShotResult}
              lastShotPosition={lastShotPosition}
            />
          )}

          {gameState.phase === 'gameOver' && (
            <BattlePhase
              player={gameState.player}
              ai={gameState.ai}
              currentPlayer={gameState.currentPlayer}
              onPlayerShot={handlePlayerShot}
              onNewGame={handleNewGame}
              winner={gameState.winner}
              lastShotResult={lastShotResult}
              lastShotPosition={lastShotPosition}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default BattleshipGame;
