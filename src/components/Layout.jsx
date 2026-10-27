import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';

export default function Layout() {
  // The layout stays mounted on the details page, preserving the results.
  const [search, setSearch] = useState({ query: '', movies: [], total: 0, page: 1, loading: false, error: '' });
  const [sort, setSort] = useState('relevance');
  const [request, setRequest] = useState({ query: '', page: 1, attempt: 0 });

  function searchMovies(query, page = 1) {
    setRequest(previous => ({ query, page, attempt: previous.attempt + 1 }));
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav request={request} searchMovies={searchMovies} setSearch={setSearch} />
      <main id="main" className="main">
        <Outlet context={{ search, sort, setSort, searchMovies }} />
      </main>
      <footer><p>Movie Search · React final project</p><a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">Movie data by OMDb ↗</a></footer>
    </div>
  );
}
