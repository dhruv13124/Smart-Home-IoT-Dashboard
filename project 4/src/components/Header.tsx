import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import AddRoomModal from './AddRoomModal';
import { Home, Zap, Mic, MicOff, Plus, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { state, dispatch } = useSmartHome();
  const [showAddRoom, setShowAddRoom] = useState(false);

  const totalDevices = state.rooms.reduce((total, room) => total + room.devices.length, 0);
  const activeDevices = state.rooms.reduce((total, room) => 
    total + room.devices.filter(device => device.isOn).length, 0
  );

  const toggleVoice = () => {
    dispatch({ type: 'TOGGLE_VOICE', payload: !state.isVoiceEnabled });
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Smart Home</h1>
              <p className="text-slate-400">
                {activeDevices} of {totalDevices} devices active
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-white font-medium">
              {state.totalPowerConsumption}W
            </span>
            <span className="text-slate-400 text-sm">total</span>
          </div>

          <button
            onClick={toggleVoice}
            className={`p-3 rounded-lg transition-colors ${
              state.isVoiceEnabled 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={state.isVoiceEnabled ? 'Voice control enabled' : 'Enable voice control'}
          >
            {state.isVoiceEnabled ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => setShowAddRoom(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Add Room</span>
          </button>

          <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {showAddRoom && (
        <AddRoomModal onClose={() => setShowAddRoom(false)} />
      )}
    </header>
  );
};

export default Header;