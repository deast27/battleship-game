'use client';

import React from 'react';
import { Ship, ShipType, Orientation, Position } from '@/types';
import { SHIP_CONFIGS, canPlaceShip, getShipPositions } from '@/lib/gameLogic';
import Grid from './Grid';

interface ShipPlacementProps {
  ships: Ship[];
  selectedShip: ShipType | null;
  orientation: Orientation;
  onShipSelect: (shipType: ShipType) => void;
  onOrientationToggle: () => void;
  onPlaceShip: (position: Position) => void;
  onRandomPlacement: () => void;
  onReset: () => void;
  onRemoveShip: (shipType: ShipType) => void;
  onStartGame: () => void;
  grid: any; // Will be typed properly when dependencies are installed
  onCellDragStart?: (position: Position) => void;
  onCellDrop?: (position: Position) => void;
}

const ShipPlacement: React.FC<ShipPlacementProps> = ({
  ships,
  selectedShip,
  orientation,
  onShipSelect,
  onOrientationToggle,
  onPlaceShip,
  onRandomPlacement,
  onReset,
  onRemoveShip,
  onStartGame,
  grid,
  onCellDragStart,
  onCellDrop
}) => {
  const getShipDisplayName = (shipType: ShipType): string => {
    const names = {
      carrier: 'Carrier (5)',
      battleship: 'Battleship (4)',
      cruiser: 'Cruiser (3)',
      submarine: 'Submarine (3)',
      destroyer: 'Destroyer (2)'
    };
    return names[shipType];
  };

  const isShipPlaced = (shipType: ShipType): boolean => {
    return ships.some(ship => ship.type === shipType);
  };

  const allShipsPlaced = ships.length === SHIP_CONFIGS.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-ocean-800 dark:text-ocean-200 mb-6 text-center">
        Place Your Ships
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ship Selection Panel */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-700 dark:text-ocean-300 mb-4">
            Select Ship to Place
          </h3>
          
          <div className="space-y-2 mb-6">
            {SHIP_CONFIGS.map(config => (
              <button
                key={config.type}
                onClick={() => isShipPlaced(config.type) ? onRemoveShip(config.type) : onShipSelect(config.type)}
                disabled={false}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  isShipPlaced(config.type)
                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900'
                    : selectedShip === config.type
                    ? 'bg-ocean-500 border-ocean-600 text-white'
                    : 'bg-white dark:bg-gray-700 border-ocean-300 dark:border-ocean-600 text-ocean-700 dark:text-ocean-300 hover:bg-ocean-50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{getShipDisplayName(config.type)}</span>
                  {isShipPlaced(config.type) ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 dark:text-green-400">✓ Placed</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveShip(config.type);
                        }}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>
              </button>
            ))}
          </div>

          {/* Orientation Toggle */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <span className="text-ocean-700 dark:text-ocean-300 font-medium">Orientation:</span>
              <button
                onClick={onOrientationToggle}
                className="px-4 py-2 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors"
              >
                {orientation === 'horizontal' ? 'Horizontal →' : 'Vertical ↓'}
              </button>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onRandomPlacement}
              className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              🎲 Random Placement
            </button>
            
            <button
              onClick={onReset}
              className="w-full px-4 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              🔄 Reset Board
            </button>
            
            <button
              onClick={onStartGame}
              disabled={!allShipsPlaced}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                allShipsPlaced
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              ⚔️ Start Battle
            </button>
          </div>
        </div>

        {/* Your Fleet Grid */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-ocean-700 dark:text-ocean-300 mb-4">
            Your Fleet
          </h3>
          <Grid
            grid={grid}
            onCellClick={onPlaceShip}
            onCellDragStart={onCellDragStart}
            onCellDrop={onCellDrop}
            showShips={true}
            isOpponent={false}
            draggableShips={true}
            ships={ships}
          />
        </div>
      </div>
    </div>
  );
};

export default ShipPlacement;
