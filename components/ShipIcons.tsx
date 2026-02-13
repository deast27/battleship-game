import React from 'react';

interface ShipIconProps {
  size?: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

// Carrier (5 cells) - Large aircraft carrier
export const CarrierIcon: React.FC<ShipIconProps> = ({ size = 32, className = '', orientation = 'horizontal' }) => {
  const imageSrc = orientation === 'horizontal' ? '/ships/carrier-horizontal.png' : '/ships/carrier-vertical.png';
  
  return (
    <img 
      src={imageSrc}
      alt="Carrier"
      width={size}
      height={size}
      className={className}
    />
  );
};

// Battleship (4 cells) - Classic battleship
export const BattleshipIcon: React.FC<ShipIconProps> = ({ size = 32, className = '', orientation = 'horizontal' }) => {
  const imageSrc = orientation === 'horizontal' ? '/ships/battleship-horizontal.png' : '/ships/battleship-vertical.png';
  
  return (
    <img 
      src={imageSrc}
      alt="Battleship"
      width={size}
      height={size}
      className={className}
    />
  );
};

// Cruiser (3 cells) - Medium warship
export const CruiserIcon: React.FC<ShipIconProps> = ({ size = 32, className = '', orientation = 'horizontal' }) => {
  const imageSrc = orientation === 'horizontal' ? '/ships/cruiser-horizontal.png' : '/ships/cruiser-vertical.png';
  
  return (
    <img 
      src={imageSrc}
      alt="Cruiser"
      width={size}
      height={size}
      className={className}
    />
  );
};

// Submarine (3 cells) - Underwater vessel
export const SubmarineIcon: React.FC<ShipIconProps> = ({ size = 32, className = '', orientation = 'horizontal' }) => {
  const imageSrc = orientation === 'horizontal' ? '/ships/submarine-horizontal.png' : '/ships/submarine-vertical.png';
  
  return (
    <img 
      src={imageSrc}
      alt="Submarine"
      width={size}
      height={size}
      className={className}
    />
  );
};

// Destroyer (2 cells) - Small fast ship
export const DestroyerIcon: React.FC<ShipIconProps> = ({ size = 32, className = '', orientation = 'horizontal' }) => {
  const imageSrc = orientation === 'horizontal' ? '/ships/destroyer-horizontal.png' : '/ships/destroyer-vertical.png';
  
  return (
    <img 
      src={imageSrc}
      alt="Destroyer"
      width={size}
      height={size}
      className={className}
    />
  );
};

// Ship icon mapping
export const shipIcons = {
  carrier: CarrierIcon,
  battleship: BattleshipIcon,
  cruiser: CruiserIcon,
  submarine: SubmarineIcon,
  destroyer: DestroyerIcon,
} as const;
