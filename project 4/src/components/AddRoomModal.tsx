import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface AddRoomModalProps {
  onClose: () => void;
}

const roomIcons = [
  'Home', 'Sofa', 'Bed', 'ChefHat', 'Bath', 'Car', 'Trees', 'Briefcase'
];

const AddRoomModal: React.FC<AddRoomModalProps> = ({ onClose }) => {
  const { addRoom } = useSmartHome();
  const [roomName, setRoomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Home');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    addRoom({
      name: roomName,
      icon: selectedIcon
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Room</h2>
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
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter room name"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Choose Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {roomIcons.map((iconName) => {
                const IconComponent = (LucideIcons as any)[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedIcon === iconName
                        ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                        : 'border-slate-600 bg-slate-700'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 text-white mx-auto" />
                  </button>
                );
              })}
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
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;