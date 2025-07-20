import React from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import RoomCard from './RoomCard';
import { Calendar, Clock, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useSmartHome();

  const totalDevices = state.rooms.reduce((total, room) => total + room.devices.length, 0);
  const activeDevices = state.rooms.reduce((total, room) => 
    total + room.devices.filter(device => device.isOn).length, 0
  );

  const todayUsage = state.rooms.reduce((total, room) => 
    total + room.devices.reduce((roomTotal, device) => roomTotal + device.usageTime, 0), 0
  );

  const formatUsageTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Devices</p>
              <p className="text-2xl font-bold text-white">{activeDevices}/{totalDevices}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Power Consumption</p>
              <p className="text-2xl font-bold text-white">{state.totalPowerConsumption}W</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Today's Usage</p>
              <p className="text-2xl font-bold text-white">{formatUsageTime(todayUsage)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-6">
        {state.rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
        
        {state.rooms.length === 0 && (
          <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No rooms yet</h3>
            <p className="text-slate-400 mb-6">
              Get started by adding your first room and connecting your smart devices
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;