import React from 'react';
import { Device } from '../types';
import { useSmartHome } from '../context/SmartHomeContext';

interface DeviceControlsProps {
  device: Device;
  roomId: string;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({ device, roomId }) => {
  const { updateDevice } = useSmartHome();

  const handleSliderChange = (key: string, value: number) => {
    updateDevice(roomId, device.id, { [key]: value });
  };

  const handleColorChange = (color: string) => {
    updateDevice(roomId, device.id, { color });
  };

  if (!device.isOn) {
    return (
      <div className="text-slate-500 text-sm italic">
        Turn on device to access controls
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {device.type === 'light' && (
        <>
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Brightness: {device.brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={device.brightness || 50}
              onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-2">Color</label>
            <div className="flex space-x-2">
              {['#FFF3CD', '#FFE5B4', '#E5E5E5', '#B4E5FF', '#E5B4FF'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    device.color === color ? 'border-white' : 'border-slate-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {device.type === 'fan' && (
        <div>
          <label className="block text-slate-300 text-sm mb-2">
            Speed: {device.speed}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={device.speed || 1}
            onChange={(e) => handleSliderChange('speed', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}

      {device.type === 'ac' && (
        <div>
          <label className="block text-slate-300 text-sm mb-2">
            Temperature: {device.temperature}°C
          </label>
          <input
            type="range"
            min="16"
            max="30"
            value={device.temperature || 24}
            onChange={(e) => handleSliderChange('temperature', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}

      {(device.type === 'geyser' || device.type === 'coffee_machine') && (
        <div>
          <label className="block text-slate-300 text-sm mb-2">
            Temperature: {device.temperature || 60}°C
          </label>
          <input
            type="range"
            min="40"
            max="100"
            value={device.temperature || 60}
            onChange={(e) => handleSliderChange('temperature', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}
    </div>
  );
};

export default DeviceControls;