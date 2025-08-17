import { useEffect, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const handleEscapeKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  const modalContent = (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={handleCloseButtonClick}
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default MovieModal;