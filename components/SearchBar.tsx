
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., '80s retro-futuristic sci-fi comedies'"
        className="flex-grow bg-gray-800/50 border-2 border-gray-700 rounded-md p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center bg-green-500 text-black font-bold font-orbitron py-3 px-6 rounded-md hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        <SearchIcon className="w-5 h-5 mr-2" />
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
};
