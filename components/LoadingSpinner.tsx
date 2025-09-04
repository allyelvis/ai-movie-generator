
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-green-400 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-green-300 font-orbitron tracking-wider">Analyzing Frequencies...</p>
      <p className="text-sm text-gray-400">AI is crafting your movie portfolio.</p>
    </div>
  );
};
