import React from 'react';

interface SimpleShipImageProps {
  shipType: string;
  size: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

// Simple ship image component with rotation support
export const SimpleShipImage: React.FC<SimpleShipImageProps> = ({ 
  shipType, 
  size, 
  className = '',
  orientation = 'horizontal'
}) => {
  const getImagePath = (type: string): string => {
    const imageMap: { [key: string]: string } = {
      carrier: '/images/carrier.png',
      battleship: '/images/battleship.png',
      cruiser: '/images/cruiser.png',
      submarine: '/images/submarine.png',
      destroyer: '/images/destroyer.png'
    };
    return imageMap[type] || '/images/carrier.png';
  };

  // Add error handling for image loading
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${getImagePath(shipType)}`);
    // Fallback to a colored div if image fails to load
    e.currentTarget.style.display = 'none';
    if (e.currentTarget.parentElement) {
      e.currentTarget.parentElement.innerHTML = `<div style="width: ${size}px; height: ${size}px; background-color: #4a5568; border-radius: 4px;"></div>`;
    }
  };

  return (
    <div 
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src={getImagePath(shipType)}
        alt={shipType}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          // Rotate the image based on orientation
          transform: orientation === 'vertical' ? 'rotate(90deg)' : 'rotate(0deg)',
          // Adjust for rotation to keep it centered
          transformOrigin: 'center'
        }}
        onError={handleImageError}
        onLoad={() => console.log(`Successfully loaded: ${getImagePath(shipType)}`)}
      />
    </div>
  );
};
