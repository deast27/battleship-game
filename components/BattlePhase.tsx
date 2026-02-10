'use client';

import React from 'react';
import { Player, Position } from '@/types';
import { getRemainingShips } from '@/lib/gameLogic';

interface BattlePhaseProps {
  player: Player;
  ai: Player;
  currentPlayer: 'player' | 'ai';
  onPlayerShot: (position: Position) => void;
  onNewGame: () => void;
  winner: 'player' | 'ai' | null;
}

const BattlePhase: React.FC<BattlePhaseProps> = ({
  player,
  ai,
  currentPlayer,
  onPlayerShot,
  onNewGame,
  winner
}) => {
  const playerShipsRemaining = getRemainingShips(player);
  const aiShipsRemaining = getRemainingShips(ai);

  if (winner) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {winner === 'player' ? '🎉 Victory!' : '💔 Defeat'}
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            {winner === 'player' 
              ? 'Congratulations! You sunk all enemy ships!' 
              : 'The AI has sunk all your ships. Try again!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Your Fleet</h3>
            <p className="text-2xl font-bold text-green-600">{playerShipsRemaining} ships remaining</p>
          </div>
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Enemy Fleet</h3>
            <p className="text-2xl font-bold text-red-600">{aiShipsRemaining} ships remaining</p>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="px-8 py-4 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors text-lg font-medium"
        >
          🔄 New Game
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-ocean-800 mb-2">Battle Phase</h2>
        <div className="flex items-center justify-center space-x-4">
          <div className={`px-4 py-2 rounded-lg font-medium ${
            currentPlayer === 'player' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            Your Turn
          </div>
          <div className="text-gray-500">vs</div>
          <div className={`px-4 py-2 rounded-lg font-medium ${
            currentPlayer === 'ai' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            AI Thinking...
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player's Grid (Defensive) */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-700 mb-4 text-center">
            Your Fleet (Defensive)
          </h3>
          <div className="flex justify-center">
            <div className="relative">
              {/* This will be replaced with the actual Grid component */}
              <div className="w-80 h-80 bg-ocean-100 rounded-lg border-2 border-ocean-300 flex items-center justify-center">
                <span className="text-ocean-600">Player Grid</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-gray-700">
              Ships Remaining: {playerShipsRemaining}/5
            </span>
          </div>
        </div>

        {/* AI's Grid (Offensive) */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-700 mb-4 text-center">
            Enemy Waters (Offensive)
          </h3>
          <div className="flex justify-center">
            <div className="relative">
              {/* This will be replaced with the actual Grid component */}
              <div className="w-80 h-80 bg-ocean-100 rounded-lg border-2 border-ocean-300 flex items-center justify-center cursor-pointer hover:bg-ocean-200 transition-colors">
                <span className="text-ocean-600">AI Grid (Click to Fire)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-gray-700">
              Enemy Ships: {aiShipsRemaining}/5
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onNewGame}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          🔄 Restart Game
        </button>
      </div>
    </div>
  );
};

export default BattlePhase;
