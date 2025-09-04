// Fix: Add a global declaration for `window.ethereum` to resolve TypeScript errors.
declare global {
  interface Window {
    ethereum?: any;
  }
}

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { MovieGrid } from './components/MovieGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { WelcomeMessage } from './components/WelcomeMessage';
import { MoviePlayerModal } from './components/MoviePlayerModal';
import { UnlockPremiumModal } from './components/UnlockPremiumModal';
import type { Movie } from './types';
import { generateMoviePortfolio } from './services/geminiService';
import { SaveIcon } from './components/icons/SaveIcon';
import { LoadIcon } from './components/icons/LoadIcon';
import { ThemeButtons } from './components/ThemeButtons';

// A cool, tech-themed placeholder video
const TRAILER_URL = "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4";

// Type guard to validate the structure of loaded data.
const isValidMovieArray = (data: any): data is Movie[] => {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'title' in item && typeof item.title === 'string' &&
        'year' in item && typeof item.year === 'number' &&
        'synopsis' in item && typeof item.synopsis === 'string' &&
        'isPremium' in item && typeof item.isPremium === 'boolean'
    )
  );
};

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}


const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [unlockingMovie, setUnlockingMovie] = useState<Movie | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
        setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                }
            } catch (err) {
                console.error("Error checking for wallet connection:", err);
            }
        }
    };
    checkWalletConnection();

    if (window.ethereum) {
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            } else {
                setWalletAddress(null);
                showNotification('Wallet disconnected.', 'info');
            }
        };
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }
  }, []);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
        showNotification('Please install a wallet extension like MetaMask.', 'error');
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            showNotification('Wallet connected successfully!', 'success');
        }
    } catch (error) {
        console.error("Wallet connection failed:", error);
        showNotification('Wallet connection was rejected.', 'error');
    }
  };

  const handleThemeSelect = (theme: string) => {
    setSearchQuery(theme);
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a theme to generate movies.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMovies([]);

    try {
      const generatedMovies = await generateMoviePortfolio(searchQuery);
      setMovies(generatedMovies);
    } catch (err) {
      console.error("Error generating movie portfolio:", err);
      setError("Failed to generate movies. The request may have been blocked. Please try a different theme.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);
  
  const handleSavePortfolio = useCallback(() => {
    if (movies.length === 0) {
        showNotification("Generate a portfolio before saving.", 'info');
        return;
    }
    try {
        localStorage.setItem('ai-movie-portfolio', JSON.stringify(movies));
        showNotification("Portfolio saved successfully!", 'success');
    } catch (e) {
        console.error("Failed to save portfolio:", e);
        showNotification("Could not save portfolio. Browser storage might be full.", 'error');
    }
  }, [movies]);

  const handleLoadPortfolio = useCallback(() => {
      try {
          const savedData = localStorage.getItem('ai-movie-portfolio');
          if (savedData) {
              const loadedData = JSON.parse(savedData);
              if (isValidMovieArray(loadedData)) {
                  setMovies(loadedData);
                  setError(null);
                  showNotification("Portfolio loaded from storage.", 'success');
              } else {
                  showNotification("Saved data is invalid or corrupted.", 'error');
              }
          } else {
              showNotification("No saved portfolio found.", 'info');
          }
      } catch (e) {
          console.error("Failed to load portfolio:", e);
          showNotification("Could not load portfolio. The data is corrupt.", 'error');
      }
  }, []);


  const handlePlayTrailer = (movie: Movie) => {
    if (movie.isPremium) {
        setUnlockingMovie(movie);
    } else {
        setPlayingMovie(movie);
    }
  };

  const handleClosePlayer = () => {
    setPlayingMovie(null);
  };

  const handleUnlockSuccess = () => {
    if (unlockingMovie) {
        setPlayingMovie(unlockingMovie);
        setUnlockingMovie(null);
    }
  };

  const handleCloseUnlockModal = () => {
    setUnlockingMovie(null);
  };

  const notificationStyles = {
    success: 'bg-green-500/20 border-green-500 text-green-300',
    error: 'bg-red-500/20 border-red-500 text-red-300',
    info: 'bg-blue-500/20 border-blue-500 text-blue-300',
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,211,153,0.15),rgba(255,255,255,0))]">
       {notification && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down ${notificationStyles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <Header walletAddress={walletAddress} onConnectWallet={handleConnectWallet} />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-2xl md:text-3xl font-orbitron text-center mb-2 text-green-400">GENERATE YOUR MOVIE PORTFOLIO</h2>
          <p className="text-center text-gray-400 mb-6">Enter a theme, genre, or concept, or select a preset below and let AI create a unique movie collection for you.</p>
          <ThemeButtons onThemeSelect={handleThemeSelect} />
          <SearchBar 
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onSearch={handleSearch} 
            isLoading={isLoading} 
          />
           <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleSavePortfolio}
              disabled={movies.length === 0}
              className="flex items-center justify-center gap-2 text-sm font-orbitron py-2 px-5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Save current portfolio"
            >
              <SaveIcon className="w-4 h-4" />
              Save Portfolio
            </button>
            <button
              onClick={handleLoadPortfolio}
              className="flex items-center justify-center gap-2 text-sm font-orbitron py-2 px-5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
              aria-label="Load saved portfolio"
            >
              <LoadIcon className="w-4 h-4" />
              Load Portfolio
            </button>
          </div>
        </div>

        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700">{error}</div>}
        
        <div className="w-full">
          {isLoading && <LoadingSpinner />}
          {!isLoading && !error && movies.length === 0 && <WelcomeMessage />}
          {!isLoading && movies.length > 0 && <MovieGrid movies={movies} onPlayTrailer={handlePlayTrailer} />}
        </div>
      </main>
      <Footer />
      {playingMovie && <MoviePlayerModal movie={playingMovie} trailerUrl={TRAILER_URL} onClose={handleClosePlayer} />}
      {unlockingMovie && <UnlockPremiumModal movie={unlockingMovie} onUnlockSuccess={handleUnlockSuccess} onClose={handleCloseUnlockModal} />}
      <style>{`
          @keyframes fade-in-down {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default App;