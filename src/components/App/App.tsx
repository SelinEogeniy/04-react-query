import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from './App.module.css';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(false);
      setMovies([]);

      const data = await fetchMovies(query);
      
      if (data.results.length === 0) {
        toast.error('No movies found for your request.');
      }
      
      setMovies(data.results);
    } catch (err) {
      setError(true);
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleMovieSelect} />
      )}
      
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;