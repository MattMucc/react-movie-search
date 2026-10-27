import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Poster({ movie }) {
  const [failed, setFailed] = useState(false);
  return movie.Poster && movie.Poster !== 'N/A' && !failed
    ? <img className="movie-card__img" src={movie.Poster} alt={`${movie.Title} poster`} loading="lazy" onError={() => setFailed(true)} />
    : <div className="movie-card__poster-placeholder">Poster unavailable</div>;
}

export default function MovieCard({ movie }) {
  return (
    <Link className="movie-card" to={`/movies/${movie.imdbID}`}>
      <Poster movie={movie} />
      <h3 className="movie-card__title">{movie.Title}</h3>
      <p className="movie-card__year">{movie.Year}</p>
    </Link>
  );
}

export function MovieSkeletons() {
  return (
    <div role="status" aria-label="Loading movies">
      <span className="sr-only">Loading movies…</span>
      <div className="movies-grid" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <div className="movie-card--skeleton" key={index}>
            <div className="movie-card__img--skeleton" />
            <div className="movie-card__title--skeleton" />
            <div className="movie-card__year--skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
