import React from 'react';

interface ThemeButtonsProps {
  onThemeSelect: (theme: string) => void;
}

const themes = [
  { name: 'Cyberpunk', prompt: 'Neon-drenched cyberpunk streets with rogue AIs and cybernetic detectives.' },
  { name: 'Fantasy', prompt: 'High fantasy world with ancient magic, mythical creatures, and epic quests.' },
  { name: 'Sci-Fi', prompt: 'Hard science fiction exploring interstellar travel, alien contact, and the future of humanity.' },
  { name: 'Noir', prompt: 'Gritty film noir mysteries with femme fatales and cynical private eyes in rain-slicked 1940s cities.' },
];

export const ThemeButtons: React.FC<ThemeButtonsProps> = ({ onThemeSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onThemeSelect(theme.prompt)}
          className="bg-gray-800/50 border border-gray-700 rounded-md px-4 py-2 text-sm text-gray-300 font-orbitron hover:border-green-500 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300 transform hover:scale-105"
          aria-label={`Select ${theme.name} theme`}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};
