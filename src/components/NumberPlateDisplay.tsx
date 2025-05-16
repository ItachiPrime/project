import React, { useRef, useEffect, useState } from 'react';
import { PlateConfig } from '../types/plateTypes';
import useTiltEffect from '../hooks/useTiltEffect';

interface NumberPlateDisplayProps {
  plateConfig: PlateConfig;
}

const NumberPlateDisplay: React.FC<NumberPlateDisplayProps> = ({ plateConfig }) => {
  const { plateNumber, isEV, fontStyle } = plateConfig;
  const plateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Use our custom tilt effect hook
  useTiltEffect(plateRef);

  useEffect(() => {
    // Add a small delay to allow the component to render before applying initial animations
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Split the plate number into characters for individual animation
  const characters = plateNumber.split('');

  // Apply appropriate font class based on selected style
  const getFontClass = () => {
    switch (fontStyle) {
      case 'bold':
        return 'tracking-wider montserrat-text';
      case 'retro':
        return 'tracking-wide poppins-text';
      case 'elegant':
        return 'tracking-normal ancizar-text';
      default:
        return 'tracking-wide';
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-[12/4] mx-auto perspective-1000"
    >
      {/* 3D container with shadow */}
      <div 
        className={`
          absolute inset-0 mx-auto 
          flex items-center justify-center
          transition-all duration-200 ease-out
          ${isInitializing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
      >
        {/* Actual plate with 3D effect */}
        <div 
          ref={plateRef}
          className={`
            relative w-full h-full max-w-[300px] mx-auto
            border-4 border-gray-800 rounded-lg overflow-hidden
            flex items-center justify-center
            transition-transform duration-300
            preserve-3d transform-style-preserve-3d
            ${isEV ? 'bg-green-500' : 'bg-white'}
          `}
          style={{ 
            boxShadow: isEV 
              ? '0 20px 30px -5px rgba(34, 197, 94, 0.4), 0 8px 10px -6px rgba(34, 197, 94, 0.3)'
              : '0 20px 30px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Blue country identifier (for UK-style plates) */}
          <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-blue-600 flex flex-col items-center justify-center text-white">
            <span className="text-xs font-bold mb-1">GB</span>
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-[8px] font-bold text-blue-600">EU</span>
            </div>
          </div>

          {/* Plate number */}
          <div className={`ml-[15%] flex items-center justify-center ${getFontClass()}`}>
            <div className="flex">
              {characters.map((char, index) => (
                <span 
                  key={index}
                  className={`
                    text-3xl sm:text-3xl md:text-4xl ${isEV ? 'text-white' : 'text-black'}
                    transition-all duration-200 ease-out
                    transform-gpu
                    ${char === ' ' ? 'w-4' : ''}
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    transform: `translateZ(${index * 2}px)`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NumberPlateDisplay;