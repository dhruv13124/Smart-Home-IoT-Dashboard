import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Room, Device, Schedule } from '../types';

interface SmartHomeState {
  rooms: Room[];
  selectedRoom: string | null;
  totalPowerConsumption: number;
  isVoiceEnabled: boolean;
}

type SmartHomeAction =
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: { id: string; updates: Partial<Room> } }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'ADD_DEVICE'; payload: { roomId: string; device: Device } }
  | { type: 'UPDATE_DEVICE'; payload: { roomId: string; deviceId: string; updates: Partial<Device> } }
  | { type: 'DELETE_DEVICE'; payload: { roomId: string; deviceId: string } }
  | { type: 'SELECT_ROOM'; payload: string | null }
  | { type: 'TOGGLE_VOICE'; payload: boolean }
  | { type: 'BULK_TOGGLE'; payload: { roomId: string; isOn: boolean } };

const initialState: SmartHomeState = {
  rooms: [
    {
      id: '1',
      name: 'Living Room',
      icon: 'Sofa',
      devices: [
        {
          id: '1',
          name: 'Main Light',
          type: 'light',
          roomId: '1',
          isOn: true,
          brightness: 80,
          color: '#FFF3CD',
          powerConsumption: 12,
          schedules: [],
          usageTime: 240,
          lastUsed: new Date()
        },
        {
          id: '2',
          name: 'Ceiling Fan',
          type: 'fan',
          roomId: '1',
          isOn: false,
          speed: 3,
          powerConsumption: 0,
          schedules: [],
          usageTime: 180
        }
      ]
    },
    {
      id: '2',
      name: 'Bedroom',
      icon: 'Bed',
      devices: [
        {
          id: '3',
          name: 'AC',
          type: 'ac',
          roomId: '2',
          isOn: false,
          temperature: 24,
          powerConsumption: 0,
          schedules: [],
          usageTime: 120
        }
      ]
    }
  ],
  selectedRoom: null,
  totalPowerConsumption: 12,
  isVoiceEnabled: false
};

function smartHomeReducer(state: SmartHomeState, action: SmartHomeAction): SmartHomeState {
  switch (action.type) {
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, action.payload]
      };
    
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.id ? { ...room, ...action.payload.updates } : room
        )
      };
    
    case 'DELETE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
        selectedRoom: state.selectedRoom === action.payload ? null : state.selectedRoom
      };
    
    case 'ADD_DEVICE':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.roomId
            ? { ...room, devices: [...room.devices, action.payload.device] }
            : room
        )
      };
    
    case 'UPDATE_DEVICE':
      const updatedRooms = state.rooms.map(room =>
        room.id === action.payload.roomId
          ? {
              ...room,
              devices: room.devices.map(device =>
                device.id === action.payload.deviceId
                  ? { ...device, ...action.payload.updates }
                  : device
              )
            }
          : room
      );
      
      const totalPower = updatedRooms.reduce((total, room) =>
        total + room.devices.reduce((roomTotal, device) => 
          roomTotal + (device.isOn ? device.powerConsumption : 0), 0
        ), 0
      );
      
      return {
        ...state,
        rooms: updatedRooms,
        totalPowerConsumption: totalPower
      };
    
    case 'DELETE_DEVICE':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.roomId
            ? { ...room, devices: room.devices.filter(device => device.id !== action.payload.deviceId) }
            : room
        )
      };
    
    case 'SELECT_ROOM':
      return {
        ...state,
        selectedRoom: action.payload
      };
    
    case 'TOGGLE_VOICE':
      return {
        ...state,
        isVoiceEnabled: action.payload
      };
    
    case 'BULK_TOGGLE':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.roomId
            ? {
                ...room,
                devices: room.devices.map(device => ({
                  ...device,
                  isOn: action.payload.isOn,
                  powerConsumption: action.payload.isOn ? device.powerConsumption : 0
                }))
              }
            : room
        )
      };
    
    default:
      return state;
  }
}

interface SmartHomeContextType {
  state: SmartHomeState;
  dispatch: React.Dispatch<SmartHomeAction>;
  addRoom: (room: Omit<Room, 'id' | 'devices'>) => void;
  addDevice: (roomId: string, device: Omit<Device, 'id'>) => void;
  updateDevice: (roomId: string, deviceId: string, updates: Partial<Device>) => void;
  toggleDevice: (roomId: string, deviceId: string) => void;
  bulkToggleRoom: (roomId: string, isOn: boolean) => void;
}

const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

export function SmartHomeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(smartHomeReducer, initialState);

  const addRoom = (room: Omit<Room, 'id' | 'devices'>) => {
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
      devices: []
    };
    dispatch({ type: 'ADD_ROOM', payload: newRoom });
  };

  const addDevice = (roomId: string, device: Omit<Device, 'id'>) => {
    const newDevice: Device = {
      ...device,
      id: Date.now().toString(),
      roomId
    };
    dispatch({ type: 'ADD_DEVICE', payload: { roomId, device: newDevice } });
  };

  const updateDevice = (roomId: string, deviceId: string, updates: Partial<Device>) => {
    dispatch({ type: 'UPDATE_DEVICE', payload: { roomId, deviceId, updates } });
  };

  const toggleDevice = (roomId: string, deviceId: string) => {
    const room = state.rooms.find(r => r.id === roomId);
    const device = room?.devices.find(d => d.id === deviceId);
    if (device) {
      updateDevice(roomId, deviceId, { 
        isOn: !device.isOn,
        lastUsed: new Date(),
        powerConsumption: !device.isOn ? getPowerConsumption(device) : 0
      });
    }
  };

  const bulkToggleRoom = (roomId: string, isOn: boolean) => {
    dispatch({ type: 'BULK_TOGGLE', payload: { roomId, isOn } });
  };

  const getPowerConsumption = (device: Device): number => {
    const basePower = {
      light: 12,
      fan: 75,
      ac: 1500,
      geyser: 2000,
      coffee_machine: 800,
      smart_plug: 5
    };
    return basePower[device.type] || 0;
  };

  return (
    <SmartHomeContext.Provider
      value={{
        state,
        dispatch,
        addRoom,
        addDevice,
        updateDevice,
        toggleDevice,
        bulkToggleRoom
      }}
    >
      {children}
    </SmartHomeContext.Provider>
  );
}

export function useSmartHome() {
  const context = useContext(SmartHomeContext);
  if (context === undefined) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
}