import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { generateAccessKeyImage } from '../services/geminiService';
import { KeyIcon } from './icons/KeyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface UnlockPremiumModalProps {
  movie: Movie;
  onUnlockSuccess: () => void;
  onClose: () => void;
}

export const UnlockPremiumModal: React.FC<UnlockPremiumModalProps> = ({ movie, onUnlockSuccess, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessKeyImage, setAccessKeyImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerateKey = async () => {
    setIsLoading(true);
    setError(null);
    // Clear previous image when regenerating
    if (accessKeyImage) {
        setAccessKeyImage(null);
    }
    try {
      const imageBytes = await generateAccessKeyImage(movie.title, movie.synopsis);
      setAccessKeyImage(`data:image/png;base64,${imageBytes}`);
    } catch (err) {
      setError('Failed to generate Digital Access Key. The content filter may have been triggered. Please try again with a different movie.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-lg"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gray-900/50 border border-yellow-500/30 rounded-lg shadow-2xl shadow-yellow-500/20 m-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold font-orbitron text-yellow-400">Premium Content Locked</h3>
            <p className="text-sm text-gray-400">Verification required for: {movie.title}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 text-center">
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md border border-red-700 mb-4">{error}</div>}

          {!accessKeyImage ? (
             <>
              <p className="text-gray-300 mb-6">To access the trailer, you must generate a unique Digital Access Key.</p>
              <button
                onClick={handleGenerateKey}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 font-bold font-orbitron py-3 px-4 rounded-md transition-all duration-300 bg-yellow-500/10 border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black disabled:bg-gray-700/50 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <>
                        <RefreshIcon className="w-5 h-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <KeyIcon className="w-5 h-5" />
                        Generate Access Key
                    </>
                )}
              </button>
            </>
          ) : (
            <div className="animate-fade-in-slow">
              <p className="text-green-400 font-bold mb-2 font-orbitron">Digital Access Key Generated</p>
              <img src={accessKeyImage} alt="AI-generated Digital Access Key" className="w-full h-auto object-contain rounded-md border-2 border-green-500/50 mb-6" />
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onUnlockSuccess}
                    className="flex-grow w-full flex items-center justify-center gap-3 font-bold font-orbitron py-3 px-4 rounded-md transition-all duration-300 bg-green-500/10 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
                >
                    <CheckCircleIcon className="w-5 h-5" />
                    Verify & Play Trailer
                </button>
                 <button
                    onClick={handleGenerateKey}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold font-orbitron py-3 px-4 rounded-md transition-all duration-300 bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white disabled:opacity-50"
                    title="Regenerate Access Key"
                    >
                    <RefreshIcon className="w-5 h-5" />
                    Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
       <style>{`
          @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          @keyframes fade-in-slow { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in-slow { animation: fade-in-slow 1s ease-out forwards; }
        `}</style>
    </div>
  );
};
