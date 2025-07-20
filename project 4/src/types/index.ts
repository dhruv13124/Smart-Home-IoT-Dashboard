export interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'geyser' | 'coffee_machine' | 'smart_plug';
  roomId: string;
  isOn: boolean;
  brightness?: number;
  speed?: number;
  temperature?: number;
  color?: string;
  powerConsumption: number;
  schedules: Schedule[];
  usageTime: number; // in minutes
  lastUsed?: Date;
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  devices: Device[];
}

export interface Schedule {
  id: string;
  deviceId: string;
  type: 'turn_on' | 'turn_off' | 'reminder';
  time: string;
  isActive: boolean;
  days: string[];
}

export interface VoiceCommand {
  command: string;
  deviceId: string;
  action: string;
}