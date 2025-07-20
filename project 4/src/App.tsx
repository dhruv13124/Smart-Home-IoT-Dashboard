import React from 'react';
import { SmartHomeProvider } from './context/SmartHomeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import VoiceControl from './components/VoiceControl';

function App() {
  return (
    <SmartHomeProvider>
      <div className="min-h-screen bg-slate-950">
        <Header />
        <Dashboard />
        <VoiceControl />
      </div>
    </SmartHomeProvider>
  );
}

export default App;