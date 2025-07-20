import React, { useEffect, useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { Mic, Volume2 } from 'lucide-react';

const VoiceControl: React.FC = () => {
  const { state, toggleDevice, bulkToggleRoom } = useSmartHome();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  useEffect(() => {
    if (!state.isVoiceEnabled) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      setLastCommand(command);
      processVoiceCommand(command);
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    if (state.isVoiceEnabled) {
      recognition.start();
    }

    return () => recognition.stop();
  }, [state.isVoiceEnabled]);

  const processVoiceCommand = (command: string) => {
    const words = command.split(' ');
    
    // Turn on/off specific device
    if (words.includes('turn') && (words.includes('on') || words.includes('off'))) {
      const action = words.includes('on');
      
      // Find room and device
      state.rooms.forEach(room => {
        room.devices.forEach(device => {
          if (command.includes(device.name.toLowerCase()) || 
              command.includes(device.type.toLowerCase())) {
            toggleDevice(room.id, device.id);
          }
        });
        
        // Bulk room control
        if (command.includes(room.name.toLowerCase()) && words.includes('all')) {
          bulkToggleRoom(room.id, action);
        }
      });
    }

    // Voice feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Command executed');
      speechSynthesis.speak(utterance);
    }
  };

  if (!state.isVoiceEnabled) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-slate-800 rounded-2xl p-4 border border-slate-600 shadow-2xl">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${isListening ? 'bg-green-600 animate-pulse' : 'bg-slate-600'}`}>
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-medium">
            {isListening ? 'Listening...' : 'Voice Control Active'}
          </p>
          {lastCommand && (
            <p className="text-slate-400 text-sm">Last: "{lastCommand}"</p>
          )}
        </div>
        <Volume2 className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};

export default VoiceControl;