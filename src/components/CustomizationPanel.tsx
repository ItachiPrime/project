import React from 'react';
import { Battery, Car } from 'lucide-react';
import { PlateConfig } from '../types/plateTypes';

interface CustomizationPanelProps {
  plateConfig: PlateConfig;
  onConfigChange: (newConfig: Partial<PlateConfig>) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ 
  plateConfig, 
  onConfigChange 
}) => {
  const { plateNumber, isEV, fontStyle } = plateConfig;

  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit to 8 characters max for the plate number
    const value = e.target.value.slice(0, 11).toUpperCase();
    onConfigChange({ plateNumber: value });
  };

  const handleEVToggle = () => {
    onConfigChange({ isEV: !isEV });
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onConfigChange({ fontStyle: e.target.value as 'standard' | 'bold' | 'retro' | 'elegant' });
  };

  return (
    <div className="space-y-6">
      <div>
        <label 
          htmlFor="plateNumber" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Plate Number
        </label>
        <input
          type="text"
          id="plateNumber"
          value={plateNumber}
          onChange={handlePlateNumberChange}
          placeholder="Enter plate number"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={14}
        />
        <p className="mt-1 text-xs text-gray-500">
          Max 8 characters (e.g. AB12 CDE)
        </p>
      </div>

      <div>
        <label 
          htmlFor="fontStyle" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Font Style
        </label>
        <select
          id="fontStyle"
          value={fontStyle}
          onChange={handleFontChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="standard">Standard</option>
          <option value="bold">Bold</option>
          <option value="retro">Retro</option>
          <option value="elegant">Elegant</option>
        </select>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Plate Type
        </span>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleEVToggle}
            className={`
              flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2
              transition-all duration-200
              ${!isEV ? 
                'bg-gray-800 text-white ring-2 ring-gray-800' : 
                'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Car size={20} />
            <span>Standard</span>
          </button>
          
          <button
            type="button"
            onClick={handleEVToggle}
            className={`
              flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2
              transition-all duration-200
              ${isEV ? 
                'bg-green-600 text-white ring-2 ring-green-600' : 
                'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Battery size={20} />
            <span>Electric</span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Tilt your device or hover with your mouse to see the 3D effect
        </p>
      </div>
    </div>
  );
};

export default CustomizationPanel;