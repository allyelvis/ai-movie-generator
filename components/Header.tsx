
import React from 'react';
import { FilmIcon } from './icons/FilmIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-4 border-b border-green-500/20 shadow-lg shadow-green-500/5">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <FilmIcon className="w-8 h-8 mr-3 text-green-400" />
        <h1 className="text-2xl md:text-4xl font-bold font-orbitron text-white tracking-widest">
          AI Movie Portfolio
        </h1>
      </div>
    </header>
  );
};
