'use client';

import React from 'react';
import { Position, CellState, type Grid } from '@/types';
import { positionToKey } from '@/lib/gameLogic';

interface GridProps {
  grid: Grid;
  onCellClick?: (position: Position) => void;
  showShips?: boolean;
  isOpponent?: boolean;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ 
  grid, 
  onCellClick, 
  showShips = false, 
  isOpponent = false,
  className = '' 
}) => {
  const getCellClass = (cellState: CellState): string => {
    const baseClass = 'w-8 h-8 border border-ocean-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200';
    
    // Debug: Log cell state to verify Tailwind is working
    console.log(`Cell state: ${cellState}, class: ${baseClass}`);
    
    switch (cellState) {
      case 'empty':
        return `${baseClass} bg-ocean-100 dark:bg-gray-700 hover:bg-ocean-200 dark:hover:bg-gray-600`;
      case 'ship':
        if (showShips) {
          return `${baseClass} bg-ship-gray dark:bg-gray-200 hover:bg-gray-600 dark:hover:bg-gray-300`;
        }
        return `${baseClass} bg-ocean-100 dark:bg-gray-700 hover:bg-ocean-200 dark:hover:bg-gray-600`;
      case 'hit':
        return `${baseClass} bg-ship-hit text-white animate-pulse`;
      case 'miss':
        return `${baseClass} bg-ship-miss dark:bg-gray-500`;
      case 'sunk':
        return `${baseClass} bg-red-600 text-white`;
      default:
        return baseClass;
    }
  };

  const getCellContent = (cellState: CellState): string => {
    switch (cellState) {
      case 'hit':
        return '💥';
      case 'miss':
        return '•';
      case 'sunk':
        return '☠';
      default:
        return '';
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (onCellClick) {
      onCellClick({ row, col });
    }
  };

  return (
    <div className={`inline-block relative ${className}`}>
      <div className={`grid grid-cols-10 gap-0 border-2 border-ocean-600 dark:border-ocean-400 bg-ocean-50 dark:bg-gray-800`}>
        {Array.from({ length: 10 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => {
            const key = positionToKey({ row, col });
            const cellState = grid[key];
            
            return (
              <div
                key={key}
                className={getCellClass(cellState)}
                onClick={() => handleCellClick(row, col)}
                role="button"
                tabIndex={0}
                aria-label={`Cell ${String.fromCharCode(65 + col)}${row + 1}`}
              >
                {getCellContent(cellState)}
              </div>
            );
          })
        )}
      </div>
      
      {/* Column labels */}
      <div className="grid grid-cols-10 gap-0 mt-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-8 text-center text-xs font-semibold text-ocean-700 dark:text-ocean-300">
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      
      {/* Row labels */}
      <div className="absolute -left-6 top-2 grid grid-rows-10 gap-0">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-8 flex items-center justify-center text-xs font-semibold text-ocean-700 dark:text-ocean-300">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
