
import React from 'react';
import type { Movie } from '../types';
import { PlayIcon } from './icons/PlayIcon';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onPlayTrailer: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index, onPlayTrailer }) => {
    const imageUrl = `https://picsum.photos/seed/${movie.title.replace(/\s/g, '')}${index}/500/750`;

    return (
        <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-green-500/20 transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20 transform hover:-translate-y-2 backdrop-blur-sm flex flex-col">
            <img src={imageUrl} alt={`Poster for ${movie.title}`} className="w-full h-80 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-orbitron text-green-400 truncate">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{movie.year}</p>
                <p className="text-gray-300 text-sm leading-relaxed h-24 overflow-y-auto pr-2 mb-4 flex-grow">
                    {movie.synopsis}
                </p>
                <button
                    onClick={() => onPlayTrailer(movie)}
                    className="mt-auto w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500 text-green-400 font-bold font-orbitron py-2 px-4 rounded-md hover:bg-green-500 hover:text-black transition-all duration-300"
                    aria-label={`Watch trailer for ${movie.title}`}
                >
                    <PlayIcon className="w-4 h-4" />
                    Watch Trailer
                </button>
            </div>
        </div>
    );
};
