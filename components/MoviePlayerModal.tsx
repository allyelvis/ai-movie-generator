
import React, { useEffect } from 'react';
import type { Movie } from '../types';

interface MoviePlayerModalProps {
  movie: Movie;
  onClose: () => void;
}

// A cool, tech-themed placeholder video
const TRAILER_URL = "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4";

export const MoviePlayerModal: React.FC<MoviePlayerModalProps> = ({ movie, onClose }) => {
  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-lg"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gray-900/50 border border-green-500/30 rounded-lg shadow-2xl shadow-green-500/20 m-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold font-orbitron text-green-400">{movie.title}</h3>
            <p className="text-sm text-gray-400">Official Trailer</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close player"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="aspect-video bg-black">
          <video
            src={TRAILER_URL}
            controls
            autoPlay
            loop
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
