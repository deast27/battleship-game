'use client';

import React from 'react';
import { Position, CellState, type Grid, Ship, ShipType } from '@/types';
import { positionToKey } from '@/lib/gameLogic';
import { shipIcons } from './ShipIcons';

interface GridProps {
  grid: Grid;
  onCellClick?: (position: Position) => void;
  onCellDrop?: (position: Position) => void;
  onCellDragStart?: (position: Position) => void;
  onCellDragOver?: (e: React.DragEvent, position: Position) => void;
  showShips?: boolean;
  isOpponent?: boolean;
  className?: string;
  draggableShips?: boolean;
  ships?: Ship[]; // Add ships prop to know which ship type is in each cell
}

const Grid: React.FC<GridProps> = ({ 
  grid, 
  onCellClick, 
  onCellDrop,
  onCellDragStart,
  onCellDragOver,
  showShips = false, 
  isOpponent = false,
  className = '',
  draggableShips = false,
  ships = []
}) => {
  // Helper function to get ship position and dimensions for overlay rendering
  const getShipOverlayStyle = (ship: Ship): React.CSSProperties => {
    if (!showShips) return {};
    
    const orientation = getShipOrientationFromPositions(ship.positions);
    const firstPos = ship.positions[0];
    const cellSize = 32; // w-8 h-8 = 32px
    const gridBorder = 2; // border-2
    
    if (orientation === 'horizontal') {
      const left = firstPos.col * cellSize + gridBorder;
      const top = firstPos.row * cellSize + gridBorder;
      const width = ship.size * cellSize;
      const height = cellSize;
      
      return {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 1,
        pointerEvents: 'none'
      };
    } else {
      const left = firstPos.col * cellSize + gridBorder;
      const top = firstPos.row * cellSize + gridBorder;
      const width = cellSize;
      const height = ship.size * cellSize;
      
      return {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 1,
        pointerEvents: 'none'
      };
    }
  };

  // Helper function to get ship orientation from positions
  const getShipOrientationFromPositions = (positions: Position[]): 'horizontal' | 'vertical' => {
    if (positions.length < 2) return 'horizontal';
    const first = positions[0];
    const second = positions[1];
    return first.row === second.row ? 'horizontal' : 'vertical';
  };

  // Helper function to get ship type at a specific position
  const getShipTypeAtPosition = (row: number, col: number): ShipType | null => {
    const position = { row, col };
    const ship = ships.find(ship => 
      ship.positions.some(pos => positionToKey(pos) === positionToKey(position))
    );
    return ship ? ship.type : null;
  };

  // Helper function to get ship orientation at a specific position
  const getShipOrientationAtPosition = (row: number, col: number): 'horizontal' | 'vertical' => {
    const position = { row, col };
    const ship = ships.find(ship => 
      ship.positions.some(pos => positionToKey(pos) === positionToKey(position))
    );
    if (!ship || ship.positions.length < 2) return 'horizontal';
    
    const first = ship.positions[0];
    const second = ship.positions[1];
    return first.row === second.row ? 'horizontal' : 'vertical';
  };

  // Helper function to check if a ship cell is the first cell of that ship
  const isFirstCellOfShip = (row: number, col: number): boolean => {
    const position = { row, col };
    const ship = ships.find(ship => 
      ship.positions.some(pos => positionToKey(pos) === positionToKey(position))
    );
    if (!ship) return false;
    
    const firstPos = ship.positions[0];
    return positionToKey(firstPos) === positionToKey(position);
  };

  // Helper function to get ship styling for each cell
  const getShipCellStyle = (row: number, col: number, cellState: CellState): string => {
    if (cellState !== 'ship' || !showShips) return '';
    
    const shipType = getShipTypeAtPosition(row, col);
    const orientation = getShipOrientationAtPosition(row, col);
    const isFirstCell = isFirstCellOfShip(row, col);
    
    if (!shipType) return '';
    
    // Get ship size to determine styling
    const ship = ships.find(s => s.type === shipType);
    if (!ship) return '';
    
    const position = { row, col };
    const shipIndex = ship.positions.findIndex(pos => positionToKey(pos) === positionToKey(position));
    const isLastCell = shipIndex === ship.positions.length - 1;
    
    let borderStyle = '';
    
    if (orientation === 'horizontal') {
      if (isFirstCell) borderStyle = 'border-l-2 border-l-gray-600';
      if (isLastCell) borderStyle += ' border-r-2 border-r-gray-600';
      borderStyle += ' border-t-2 border-b-2 border-gray-600';
    } else {
      if (isFirstCell) borderStyle = 'border-t-2 border-t-gray-600';
      if (isLastCell) borderStyle += ' border-b-2 border-b-gray-600';
      borderStyle += ' border-l-2 border-r-2 border-gray-600';
    }
    
    // Add ship-specific colors
    const shipColors = {
      carrier: 'bg-gray-500',
      battleship: 'bg-blue-600',
      cruiser: 'bg-green-600',
      submarine: 'bg-gray-400',
      destroyer: 'bg-red-600'
    };
    
    return `${shipColors[shipType]} ${borderStyle}`;
  };

  const getCellClass = (row: number, col: number, cellState: CellState): string => {
    const isAttacked = cellState === 'hit' || cellState === 'miss' || cellState === 'sunk';
    const baseClass = `w-8 h-8 border border-ocean-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
      isAttacked ? 'cursor-default' : 'cursor-pointer'
    }`;
    
    // Debug: Log cell state to verify Tailwind is working
    console.log(`Cell state: ${cellState}, class: ${baseClass}`);
    
    switch (cellState) {
      case 'empty':
        return `${baseClass} bg-transparent hover:bg-blue-200 hover:bg-opacity-30 dark:hover:bg-blue-800 dark:hover:bg-opacity-30`;
      case 'ship':
        // Ship cells are now handled by overlays, so just show base styling
        return `${baseClass} bg-transparent hover:bg-blue-200 hover:bg-opacity-30 dark:hover:bg-blue-800 dark:hover:bg-opacity-30`;
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

  const getCellContent = (row: number, col: number, cellState: CellState): React.ReactNode => {
    switch (cellState) {
      case 'hit':
        return '💥';
      case 'miss':
        return '•';
      case 'sunk':
        return '';
      case 'ship':
        // Don't show individual ship icons anymore - they'll be rendered as overlays
        return '';
      default:
        return '';
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (onCellClick) {
      onCellClick({ row, col });
    }
  };

  const handleCellClickWithCheck = (row: number, col: number, cellState: CellState) => {
    // Prevent clicks on already attacked cells
    const isAttacked = cellState === 'hit' || cellState === 'miss' || cellState === 'sunk';
    if (!isAttacked && onCellClick) {
      onCellClick({ row, col });
    }
  };

  // Simplified approach - just use desktop drag and drop with better mobile support
  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    if (onCellDragStart && draggableShips) {
      onCellDragStart({ row, col });
    }
  };

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (onCellDragOver) {
      onCellDragOver(e, { row, col });
    }
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (onCellDrop) {
      onCellDrop({ row, col });
    }
  };

  return (
    <div className={`inline-block relative ${className}`}>
      <div 
        className={`grid grid-cols-10 gap-0 border-2 border-ocean-600 dark:border-ocean-400 relative overflow-hidden`}
        style={{
          backgroundImage: 'url(/oceanwater.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5
        }}
      >
        {Array.from({ length: 10 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => {
            const key = positionToKey({ row, col });
            const cellState = grid[key];
            const cellClass = getCellClass(row, col, cellState);
            
            return (
              <div
                key={key}
                className={cellClass}
                onClick={() => handleCellClickWithCheck(row, col, cellState)}
                draggable={draggableShips && cellState === 'ship' && showShips}
                onDragStart={(e) => handleDragStart(e, row, col)}
                onDragOver={(e) => handleDragOver(e, row, col)}
                onDrop={(e) => handleDrop(e, row, col)}
                role="button"
                tabIndex={0}
                aria-label={`Cell ${String.fromCharCode(65 + col)}${row + 1}`}
              >
                {getCellContent(row, col, cellState)}
              </div>
            );
          })
        )}
      </div>
      
      {/* Ship overlays - render ships as single continuous images */}
      {(() => {
        const shipsToShow = !isOpponent ? ships : ships.filter(ship => ship.isSunk);
        console.log('Grid rendering - isOpponent:', isOpponent, 'shipsToShow:', shipsToShow.length, 'showShips:', showShips);
        return showShips && shipsToShow.map(ship => {
          const IconComponent = shipIcons[ship.type];
          const orientation = getShipOrientationFromPositions(ship.positions);
          const overlayStyle = getShipOverlayStyle(ship);
          
          console.log('Rendering ship:', ship.type, 'isOpponent:', isOpponent, 'isSunk:', ship.isSunk);
          
          return (
            <div key={ship.id} style={overlayStyle}>
              <IconComponent 
                size={orientation === 'horizontal' ? ship.size * 32 : ship.size * 32}
                orientation={orientation}
                className={`w-full h-full ${
                  isOpponent && ship.isSunk ? 'opacity-75 grayscale border-2 border-yellow-400' : ''
                }`}
              />
            </div>
          );
        });
      })()}
      
      {/* Column labels */}
      <div className="grid grid-cols-10 gap-0 mt-1 relative z-10">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-8 text-center text-xs font-semibold text-ocean-700 dark:text-ocean-300">
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      
      {/* Row labels */}
      <div className="absolute left-0 top-0 grid grid-rows-10 gap-0 -translate-x-full z-10">
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
