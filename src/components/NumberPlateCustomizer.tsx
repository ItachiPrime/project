import React, { useState } from 'react';
import NumberPlateDisplay from './NumberPlateDisplay';
import CustomizationPanel from './CustomizationPanel';
import { PlateConfig } from '../types/plateTypes';

const NumberPlateCustomizer: React.FC = () => {
  const [plateConfig, setPlateConfig] = useState<PlateConfig>({
    plateNumber: 'AB12 CDE',
    isEV: false,
    fontStyle: 'standard',
  });

  const handleConfigChange = (newConfig: Partial<PlateConfig>) => {
    setPlateConfig((prevConfig) => ({
      ...prevConfig,
      ...newConfig,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
      <div className="md:flex flex-col">
        <div className="p-4 md:p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <h1 className="text-2xl font-bold text-center mb-2">License Plate Customizer</h1>
          <p className="text-sm text-center opacity-80">Customize your perfect plate and see it in 3D</p>
        </div>
        
        <div className="p-6">
          <NumberPlateDisplay plateConfig={plateConfig} />
          
          <div className="mt-8">
            <CustomizationPanel 
              plateConfig={plateConfig} 
              onConfigChange={handleConfigChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberPlateCustomizer;