import React, { useState } from 'react';
import { Room } from '../types';
import { useSmartHome } from '../context/SmartHomeContext';
import DeviceCard from './DeviceCard';
import AddDeviceModal from './AddDeviceModal';
import { Power, PowerOff, Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { bulkToggleRoom } = useSmartHome();
  const [showAddDevice, setShowAddDevice] = useState(false);
  
  const IconComponent = (LucideIcons as any)[room.icon] || LucideIcons.Home;
  const activeDevices = room.devices.filter(device => device.isOn).length;
  const totalPower = room.devices.reduce((total, device) => 
    total + (device.isOn ? device.powerConsumption : 0), 0
  );

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500 rounded-xl">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{room.name}</h2>
            <p className="text-slate-400">
              {activeDevices} of {room.devices.length} devices on • {totalPower}W
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => bulkToggleRoom(room.id, true)}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            title="Turn all on"
          >
            <Power className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => bulkToggleRoom(room.id, false)}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            title="Turn all off"
          >
            <PowerOff className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {room.devices.map((device) => (
          <DeviceCard key={device.id} device={device} roomId={room.id} />
        ))}
        
        <button
          onClick={() => setShowAddDevice(true)}
          className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-slate-700 transition-colors min-h-[200px]"
        >
          <Plus className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-slate-400">Add Device</span>
        </button>
      </div>

      {showAddDevice && (
        <AddDeviceModal
          roomId={room.id}
          onClose={() => setShowAddDevice(false)}
        />
      )}
    </div>
  );
};

export default RoomCard;