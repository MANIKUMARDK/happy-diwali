import React from 'react';
import Fireworks from './Fireworks';

const App: React.FC = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Fireworks />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center px-4">
        <h1 
          className="text-5xl md:text-8xl font-bold text-center animate-popup"
          style={{
            background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF4500, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(255, 223, 0, 0.7))',
          }}
        >
          Happy Diwali
        </h1>
        <p className="text-yellow-200 mt-4 text-lg md:text-2xl animate-popup" style={{ animationDelay: '0.3s', opacity: 0, filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))' }}>
          May the festival of lights fill your life with joy and prosperity.
        </p>

        <div className="mt-12 max-w-2xl animate-popup" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <p className="text-gray-300 text-md md:text-xl italic" style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))' }}>
                "The festival of lights is a celebration of the victory of light over darkness, good over evil, and knowledge over ignorance."
            </p>
            <p className="text-amber-400 mt-6 text-right font-semibold text-xl md:text-3xl pr-4" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 200, 100, 0.6))' }}>
                - DK King
            </p>
        </div>
      </div>
    </div>
  );
};

export default App;
