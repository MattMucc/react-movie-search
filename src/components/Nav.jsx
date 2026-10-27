import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMovies } from '../api/omdb';
import logo from '../assets/fes-logo.png';

export default function Nav({ request, searchMovies, setSearch }) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!request.query) return;
    const controller = new AbortController();
    setSearch({ query: request.query, page: request.page, movies: [], total: 0, loading: true, error: '' });
    fetchMovies({ s: request.query, type: 'movie', page: String(request.page) }, controller.signal)
      .then(data => {
        if (!controller.signal.aborted) setSearch({ query: request.query, page: request.page, movies: data.Search || [], total: Number(data.totalResults) || 0, loading: false, error: '' });
      })
      .catch(error => {
        if (!controller.signal.aborted) setSearch({ query: request.query, page: request.page, movies: [], total: 0, loading: false, error: error.message });
      });
    return () => controller.abort();
  }, [request, setSearch]);

  function onSubmit(event) {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;
    searchMovies(query);
    navigate('/');
  }

  return (
    <header>
      <nav className="nav" aria-label="Main navigation">
        <Link className="logo" to="/" aria-label="Movie Search home">
          <img className="logo__img" src={logo} alt="" />
          <p className="logo__title">Movie<span>Search</span></p>
        </Link>
        <form className="search-form" onSubmit={onSubmit} role="search">
          <div className="search-form__group">
            <label className="sr-only" htmlFor="movie-search">Search movies</label>
            <input className="search-form__input" id="movie-search" type="search" placeholder="Search for a movie…" value={input} onChange={event => setInput(event.target.value)} required />
            <button className="search-form__button" type="submit" disabled={!input.trim()} aria-label="Search">
              <svg className="search-form__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg>
            </button>
          </div>
        </form>
      </nav>
    </header>
  );
}
