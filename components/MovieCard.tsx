
import React from 'react';
import type { Movie } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { StarIcon } from './icons/StarIcon';
import { UnlockIcon } from './icons/UnlockIcon';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onPlayTrailer: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index, onPlayTrailer }) => {
    const imageUrl = `https://picsum.photos/seed/${movie.title.replace(/\s/g, '')}${index}/500/750`;

    return (
        <div className="relative bg-gray-900/50 rounded-lg overflow-hidden border border-green-500/20 transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20 transform hover:-translate-y-2 backdrop-blur-sm flex flex-col">
            {movie.isPremium && (
                <div className="absolute top-3 right-3 flex items-center bg-yellow-500/20 border border-yellow-500 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm z-10">
                    <StarIcon className="w-4 h-4 mr-1" />
                    PREMIUM
                </div>
            )}
            <img src={imageUrl} alt={`Poster for ${movie.title}`} className="w-full h-80 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-orbitron text-green-400 truncate">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{movie.year}</p>
                <p className="text-gray-300 text-sm leading-relaxed h-24 overflow-y-auto pr-2 mb-4 flex-grow">
                    {movie.synopsis}
                </p>
                <button
                    onClick={() => onPlayTrailer(movie)}
                    className={`mt-auto w-full flex items-center justify-center gap-2 font-bold font-orbitron py-2 px-4 rounded-md transition-all duration-300 ${
                        movie.isPremium
                            ? 'bg-yellow-500/10 border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black'
                            : 'bg-green-500/10 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black'
                    }`}
                    aria-label={`Watch trailer for ${movie.title}`}
                >
                    {movie.isPremium ? <UnlockIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                    {movie.isPremium ? 'Unlock Trailer' : 'Watch Trailer'}
                </button>
            </div>
        </div>
    );
};
