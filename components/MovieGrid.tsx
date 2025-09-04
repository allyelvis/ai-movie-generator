
import React from 'react';
import type { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onPlayTrailer: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onPlayTrailer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {movies.map((movie, index) => (
        <MovieCard key={`${movie.title}-${index}`} movie={movie} index={index} onPlayTrailer={onPlayTrailer} />
      ))}
    </div>
  );
};
