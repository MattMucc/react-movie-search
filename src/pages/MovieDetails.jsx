import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMovies } from '../api/omdb';
import { Poster } from '../components/MovieCard';
const display = value => value && value !== 'N/A' ? value : 'Not available';
export default function MovieDetails() {
  const { id } = useParams();
  const [state, setState] = useState({ movie: null, loading: true, error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ movie: null, loading: true, error: '' });
    fetchMovies({ i: id, plot: 'full' }, controller.signal)
      .then(movie => { if (!controller.signal.aborted) setState({ movie, loading: false, error: '' }); })
      .catch(error => { if (!controller.signal.aborted) setState({ movie: null, loading: false, error: error.message }); });
    return () => controller.abort();
  }, [id, attempt]);
  const movie = state.movie;
  return <section className="movie-details__container"><Link className="movie-details__back-link" to="/">← Back to movies</Link>
    {state.loading ? <div role="status" aria-label="Loading movie details" className="movie-details__content"><div className="movie-details__poster--skeleton" /><div><div className="movie-details__title--skeleton" /><div className="movie-details__info-line--skeleton" /><div className="movie-details__title--skeleton" /><span className="sr-only">Loading movie details…</span></div></div> : state.error ? <div className="empty-state" role="alert"><h1>Movie unavailable</h1><p>{state.error}</p><button onClick={() => setAttempt(value => value + 1)}>Try again</button></div> : <article className="movie-details__content"><Poster key={id} movie={movie} /><div className="movie-details__info"><p className="eyebrow">RELEASE YEAR / {display(movie.Year)}</p><h1 className="movie-details__title">{movie.Title}</h1><p className="movie-meta">{display(movie.Rated)} · {display(movie.Runtime)} · {display(movie.Genre)}</p><p className="rating">★ {display(movie.imdbRating)} <span>/ 10 on IMDb</span></p><h2>The story</h2><p className="plot">{display(movie.Plot)}</p><dl>{[['Director', movie.Director], ['Cast', movie.Actors], ['Writer', movie.Writer], ['Released', movie.Released], ['Language', movie.Language], ['Awards', movie.Awards]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{display(value)}</dd></div>)}</dl></div></article>}
  </section>;
}

