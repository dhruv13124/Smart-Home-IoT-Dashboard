import React from 'react';
import { Device } from '../types';
import { useSmartHome } from '../context/SmartHomeContext';
import DeviceControls from './DeviceControls';
import { Lightbulb, Fan, Snowflake, Droplets, Coffee, Plug } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  roomId: string;
}

const deviceIcons = {
  light: Lightbulb,
  fan: Fan,
  ac: Snowflake,
  geyser: Droplets,
  coffee_machine: Coffee,
  smart_plug: Plug
};

const DeviceCard: React.FC<DeviceCardProps> = ({ device, roomId }) => {
  const { toggleDevice } = useSmartHome();
  const IconComponent = deviceIcons[device.type];

  const formatUsageTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className={`bg-slate-800 rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
      device.isOn ? 'border-blue-500 bg-slate-700' : 'border-slate-600'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${device.isOn ? 'bg-blue-500' : 'bg-slate-600'}`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">{device.name}</h3>
            <p className="text-slate-400 text-sm capitalize">{device.type.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={() => toggleDevice(roomId, device.id)}
          className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
            device.isOn ? 'bg-blue-500' : 'bg-slate-600'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
              device.isOn ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      <DeviceControls device={device} roomId={roomId} />

      <div className="mt-4 pt-4 border-t border-slate-600">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Power Usage</p>
            <p className={`font-medium ${device.isOn ? 'text-red-400' : 'text-slate-400'}`}>
              {device.isOn ? `${device.powerConsumption}W` : '0W'}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Today's Usage</p>
            <p className="text-white font-medium">{formatUsageTime(device.usageTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;