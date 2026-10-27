export async function fetchMovies(parameters, signal) {
  const query = new URLSearchParams({ apikey: process.env.REACT_APP_OMDB_API_KEY, ...parameters });
  const response = await fetch(`https://www.omdbapi.com/?${query}`, { signal });
  if (!response.ok) throw new Error('Unable to reach OMDb. Please try again.');
  const data = await response.json();
  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!' && parameters.s) return { Search: [], totalResults: '0' };
    throw new Error(data.Error || 'Unable to load movies. Please try again.');
  }
  return data;
}
