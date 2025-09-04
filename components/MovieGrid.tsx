
import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onPlayTrailer: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onPlayTrailer }) => {
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  useEffect(() => {
    const generateHash = async () => {
      if (!movies || movies.length === 0) {
        setPortfolioId(null);
        return;
      }
      try {
        const dataString = JSON.stringify(movies.map(m => ({t: m.title, s: m.synopsis})));
        const encoder = new TextEncoder();
        const data = encoder.encode(dataString);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setPortfolioId(hashHex.substring(0, 32)); // Display a shortened hash for aesthetics
      } catch (error) {
        console.error("Failed to generate portfolio hash:", error);
        setPortfolioId("Error generating ID");
      }
    };

    generateHash();
  }, [movies]);

  return (
    <>
       {portfolioId && (
        <div className="mb-8 text-center animate-fade-in-slow">
          <p className="text-gray-500 text-sm font-orbitron tracking-wider">CRYPTO PORTFOLIO ID</p>
          <p className="font-mono text-green-400 break-all text-lg">{portfolioId}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.title}-${index}`} movie={movie} index={index} onPlayTrailer={onPlayTrailer} />
        ))}
      </div>
      <style>{`
          @keyframes fade-in-slow {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in-slow {
            animation: fade-in-slow 1s ease-out forwards;
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-in-out forwards;
          }
        `}</style>
    </>
  );
};
