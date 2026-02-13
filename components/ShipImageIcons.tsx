import React from 'react';

interface ShipImageIconProps {
  size?: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

// Carrier (5 cells) - Using the provided ship image
export const CarrierImageIcon: React.FC<ShipImageIconProps> = ({ 
  size = 32, 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const width = orientation === 'horizontal' ? size * 5 : size;
  const height = orientation === 'horizontal' ? size : size * 5;
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src="/images/carrier.png"
        alt="Carrier"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// Battleship (4 cells) - Using the provided ship image
export const BattleshipImageIcon: React.FC<ShipImageIconProps> = ({ 
  size = 32, 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const width = orientation === 'horizontal' ? size * 4 : size;
  const height = orientation === 'horizontal' ? size : size * 4;
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src="/images/battleship.png"
        alt="Battleship"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// Cruiser (3 cells) - Using the provided ship image
export const CruiserImageIcon: React.FC<ShipImageIconProps> = ({ 
  size = 32, 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const width = orientation === 'horizontal' ? size * 3 : size;
  const height = orientation === 'horizontal' ? size : size * 3;
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src="/images/cruiser.png"
        alt="Cruiser"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// Submarine (3 cells) - Using the provided ship image
export const SubmarineImageIcon: React.FC<ShipImageIconProps> = ({ 
  size = 32, 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const width = orientation === 'horizontal' ? size * 3 : size;
  const height = orientation === 'horizontal' ? size : size * 3;
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src="/images/submarine.png"
        alt="Submarine"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// Destroyer (2 cells) - Using the provided ship image
export const DestroyerImageIcon: React.FC<ShipImageIconProps> = ({ 
  size = 32, 
  className = '', 
  orientation = 'horizontal' 
}) => {
  const width = orientation === 'horizontal' ? size * 2 : size;
  const height = orientation === 'horizontal' ? size : size * 2;
  
  return (
    <div 
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src="/images/destroyer.png"
        alt="Destroyer"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// Ship image icon mapping
export const shipImageIcons = {
  carrier: CarrierImageIcon,
  battleship: BattleshipImageIcon,
  cruiser: CruiserImageIcon,
  submarine: SubmarineImageIcon,
  destroyer: DestroyerImageIcon,
} as const;
