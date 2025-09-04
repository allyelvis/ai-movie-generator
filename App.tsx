
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { MovieGrid } from './components/MovieGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { WelcomeMessage } from './components/WelcomeMessage';
import { MoviePlayerModal } from './components/MoviePlayerModal';
import type { Movie } from './types';
import { generateMoviePortfolio } from './services/geminiService';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

  const handleSearch = useCallback(async (theme: string) => {
    if (!theme.trim()) {
      setError("Please enter a theme to generate movies.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMovies([]);

    try {
      const generatedMovies = await generateMoviePortfolio(theme);
      setMovies(generatedMovies);
    } catch (err) {
      console.error("Error generating movie portfolio:", err);
      setError("Failed to generate movies. The request may have been blocked. Please try a different theme.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePlayTrailer = (movie: Movie) => {
    setPlayingMovie(movie);
  };

  const handleClosePlayer = () => {
    setPlayingMovie(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,211,153,0.15),rgba(255,255,255,0))]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-3xl mb-12">
          <h2 className="text-2xl md:text-3xl font-orbitron text-center mb-2 text-green-400">GENERATE YOUR MOVIE PORTFOLIO</h2>
          <p className="text-center text-gray-400 mb-6">Enter a theme, genre, or concept, and let AI create a unique movie collection for you.</p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700">{error}</div>}
        
        <div className="w-full">
          {isLoading && <LoadingSpinner />}
          {!isLoading && !error && movies.length === 0 && <WelcomeMessage />}
          {!isLoading && movies.length > 0 && <MovieGrid movies={movies} onPlayTrailer={handlePlayTrailer} />}
        </div>
      </main>
      <Footer />
      {playingMovie && <MoviePlayerModal movie={playingMovie} onClose={handleClosePlayer} />}
    </div>
  );
};

export default App;
