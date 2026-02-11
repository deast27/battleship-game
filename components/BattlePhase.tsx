'use client';

import React, { useEffect, useState } from 'react';
import { Player, Position } from '@/types';
import { getRemainingShips } from '@/lib/gameLogic';
import Grid from './Grid';

interface BattlePhaseProps {
  player: Player;
  ai: Player;
  currentPlayer: 'player' | 'ai';
  onPlayerShot: (position: Position) => void;
  onNewGame: () => void;
  winner: 'player' | 'ai' | null;
  lastShotResult: 'hit' | 'miss' | null;
  lastShotPosition: Position | null;
  showFinalBoard?: boolean;
  onToggleFinalBoard?: () => void;
  isAIThinking?: boolean;
}

const BattlePhase: React.FC<BattlePhaseProps> = ({
  player,
  ai,
  currentPlayer,
  onPlayerShot,
  onNewGame,
  winner,
  lastShotResult,
  lastShotPosition,
  showFinalBoard = false,
  onToggleFinalBoard,
  isAIThinking = false
}) => {
  const [showResult, setShowResult] = useState(false);

  // Calculate position for hit/miss display (between the two grids on row 5)
  const getResultPosition = () => {
    // Position between the two grids, aligned with row 5 (index 4)
    const targetRow = 4; // Row 5
    const cellSize = 32; // w-8 h-8 = 32px each cell
    const headerHeight = 140; // Header + turn indicator + spacing height
    const gridGap = 0; // Grid has no gap between cells
    
    const position = {
      top: `${headerHeight + (targetRow * (cellSize + gridGap)) + cellSize/2}px`,
      left: `50%`, // Center between the two grids
      transform: `translate(-50%, -50%)`
    };
    
    return position;
  };

  // Show shot result for 1 second
  useEffect(() => {
    if (lastShotResult) {
      setShowResult(true);
      const timer = setTimeout(() => {
        setShowResult(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [lastShotResult, lastShotPosition]); // Add lastShotPosition to trigger on every attack
  const playerShipsRemaining = getRemainingShips(player);
  const aiShipsRemaining = getRemainingShips(ai);

  if (winner) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {winner === 'player' ? '🎉 Victory!' : '💔 Defeat'}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            {winner === 'player' 
              ? 'Congratulations! You sunk all enemy ships!' 
              : 'The AI has sunk all your ships. Try again!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">Your Fleet</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{playerShipsRemaining} ships remaining</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4">Enemy Fleet</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{aiShipsRemaining} ships remaining</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={onToggleFinalBoard}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            {showFinalBoard ? 'Hide Final Board' : 'View Final Board'}
          </button>
          <button
            onClick={onNewGame}
            className="px-8 py-4 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors text-lg font-medium"
          >
            🔄 New Game
          </button>
        </div>

        {showFinalBoard && (
          <div className="mt-8 border-t pt-8">
            <h3 className="text-2xl font-bold text-center text-ocean-800 dark:text-ocean-200 mb-6">Final Board Positions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-ocean-700 dark:text-ocean-300 mb-4 text-center">Your Fleet</h4>
                <div className="flex justify-center">
                  <Grid
                    grid={player.grid}
                    showShips={true}
                    isOpponent={false}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-ocean-700 dark:text-ocean-300 mb-4 text-center">AI Fleet</h4>
                <div className="flex justify-center">
                  <Grid
                    grid={ai.grid}
                    showShips={true}
                    isOpponent={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-ocean-800 dark:text-ocean-200 mb-2">Battle Phase</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player's Grid (Defensive) */}
        <div>
          <div className="text-center mb-4">
            <div className={`px-4 py-2 rounded-lg font-medium inline-block ${
              currentPlayer === 'player' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
              Player 1
            </div>
          </div>
          <h3 className="text-lg font-semibold text-ocean-700 dark:text-ocean-300 mb-4 text-center">
            Your Fleet (Defensive)
          </h3>
          <div className="flex justify-center">
            <div className="relative">
              <Grid
                grid={player.grid}
                showShips={true}
                isOpponent={false}
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ships Remaining: {playerShipsRemaining}/5
            </span>
          </div>
        </div>

        {/* AI's Grid (Offensive) */}
        <div>
          <div className="text-center mb-4">
            <div className={`px-4 py-2 rounded-lg font-medium inline-block ${
              currentPlayer === 'ai' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
              HorAItio Nelson (AI)
            </div>
          </div>
          <h3 className="text-lg font-semibold text-ocean-700 dark:text-ocean-300 mb-4 text-center">
            Enemy Waters (Offensive)
          </h3>
          <div className="flex justify-center">
            <div className="relative">
              <Grid
                grid={ai.grid}
                showShips={false}
                isOpponent={true}
                onCellClick={currentPlayer === 'player' && !isAIThinking ? onPlayerShot : undefined}
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enemy Ships: {aiShipsRemaining}/5
            </span>
          </div>
        </div>
      </div>

      {/* Shot Result Display */}
      {showResult && lastShotResult && lastShotPosition && (
        <div className="fixed z-50 pointer-events-none" style={getResultPosition()}>
          <div className={`px-6 py-3 rounded-lg font-bold text-white text-lg shadow-lg transition-all duration-300 ${
            lastShotResult === 'hit' 
              ? 'bg-red-500 animate-bounce-subtle' 
              : 'bg-gray-500 animate-pulse'
          }`}>
            {lastShotResult === 'hit' ? '🎯 Hit!' : '💭 Miss!'}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={onNewGame}
          className="px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          🔄 Restart Game
        </button>
      </div>
    </div>
  );
};

export default BattlePhase;
