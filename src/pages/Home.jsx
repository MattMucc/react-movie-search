import { useOutletContext } from 'react-router-dom';
import MovieCard, { MovieSkeletons } from '../components/MovieCard';

export default function Home() {
  const { search, sort, setSort, searchMovies } = useOutletContext();
    const pages = Math.min(100, Math.ceil(search.total / 10));

  const sorted = [...search.movies].sort((a, b) => {
    if (sort === 'az') return a.Title.localeCompare(b.Title);
    if (sort === 'za') return b.Title.localeCompare(a.Title);
    if (sort === 'newest') return (parseInt(b.Year, 10) || 0) - (parseInt(a.Year, 10) || 0);
    if (sort === 'oldest') return (parseInt(a.Year, 10) || 0) - (parseInt(b.Year, 10) || 0);

    return 0;
  });

  return <>
    <section className="results" aria-labelledby="results-heading" aria-busy={search.loading}>
      <div className="controls"><div><p className="eyebrow">EXPLORE THE COLLECTION</p><h2 id="results-heading">{search.query ? `Results for “${search.query}”` : 'What are you in the mood for?'}</h2><p className="muted" aria-live="polite">{search.loading ? 'Finding your films…' : search.query && !search.error ? `${search.total.toLocaleString()} movies found · sorting this page` : 'Search a title to discover your next watch.'}</p></div>
      <div className="sort-control"><label htmlFor="sortSelect">Sort by</label><select id="sortSelect" value={sort} onChange={event => setSort(event.target.value)}><option value="relevance">Relevance</option><option value="az">Alphabetical A–Z</option><option value="za">Alphabetical Z–A</option><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div></div>
      {search.loading ? <MovieSkeletons /> : search.error ? <div className="empty-state" role="alert"><h3>We couldn’t load those movies</h3><p>{search.error}</p><button onClick={() => searchMovies(search.query, search.page)}>Try again</button></div> : sorted.length ? <div className="movies-grid">{sorted.map(movie => <MovieCard movie={movie} key={movie.imdbID} />)}</div> : <div className="empty-state"><span className="empty-icon" aria-hidden="true">◫</span><h3>{search.query ? 'No movies found' : 'Every great night starts with a movie.'}</h3><p>{search.query ? 'Try another title or check your spelling.' : 'Use the search above to get started.'}</p></div>}
      {!search.loading && !search.error && pages > 1 && <nav className="pagination" aria-label="Results pages"><button disabled={search.page === 1} onClick={() => searchMovies(search.query, search.page - 1)}>← Previous</button><span>Page {search.page} of {pages}</span><button disabled={search.page >= pages} onClick={() => searchMovies(search.query, search.page + 1)}>Next →</button></nav>}
    </section>
  </>;
}
