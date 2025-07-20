import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { Device } from '../types';
import { X, Lightbulb, Fan, Snowflake, Droplets, Coffee, Plug } from 'lucide-react';

interface AddDeviceModalProps {
  roomId: string;
  onClose: () => void;
}

const deviceTypes = [
  { value: 'light', label: 'Light', icon: Lightbulb, power: 12 },
  { value: 'fan', label: 'Fan', icon: Fan, power: 75 },
  { value: 'ac', label: 'Air Conditioner', icon: Snowflake, power: 1500 },
  { value: 'geyser', label: 'Water Heater', icon: Droplets, power: 2000 },
  { value: 'coffee_machine', label: 'Coffee Machine', icon: Coffee, power: 800 },
  { value: 'smart_plug', label: 'Smart Plug', icon: Plug, power: 5 }
];

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ roomId, onClose }) => {
  const { addDevice } = useSmartHome();
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState<Device['type']>('light');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;

    const selectedType = deviceTypes.find(type => type.value === deviceType);
    
    const newDevice = {
      name: deviceName,
      type: deviceType,
      roomId,
      isOn: false,
      brightness: deviceType === 'light' ? 50 : undefined,
      speed: deviceType === 'fan' ? 1 : undefined,
      temperature: ['ac', 'geyser', 'coffee_machine'].includes(deviceType) ? 
        (deviceType === 'ac' ? 24 : 60) : undefined,
      color: deviceType === 'light' ? '#FFF3CD' : undefined,
      powerConsumption: 0,
      schedules: [],
      usageTime: 0
    };

    addDevice(roomId, newDevice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Device</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Device Name
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter device name"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Device Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {deviceTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setDeviceType(type.value as Device['type'])}
                  className={`p-3 rounded-lg border transition-colors ${
                    deviceType === type.value
                      ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                      : 'border-slate-600 bg-slate-700'
                  }`}
                >
                  <type.icon className="w-5 h-5 text-white mx-auto mb-1" />
                  <div className="text-xs text-white">{type.label}</div>
                  <div className="text-xs text-slate-400">{type.power}W</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;