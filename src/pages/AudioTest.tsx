import React from 'react';
import AudioDemo from '../components/AudioDemo';

const AudioTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto py-8">
        <AudioDemo />
      </div>
    </div>
  );
};

export default AudioTest; 