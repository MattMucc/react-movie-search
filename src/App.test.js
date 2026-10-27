import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchMovies } from './api/omdb';

jest.mock('./api/omdb', () => ({ fetchMovies: jest.fn() }));
const movies = [
  { imdbID: 'tt001', Title: 'Zulu', Year: '2000', Poster: 'N/A' },
  { imdbID: 'tt002', Title: 'Alpha', Year: '2020', Poster: 'N/A' },
];
beforeEach(() => { window.history.replaceState({}, '', '/'); fetchMovies.mockReset(); });
function search(query = 'test') {
  userEvent.type(screen.getByRole('searchbox', { name: 'Search movies' }), query);
  userEvent.click(screen.getByRole('button', { name: /Search/ }));
}
function titles() { return screen.getAllByRole('heading', { level: 3 }).map(element => element.textContent); }

test('searches, sorts all four ways, and preserves results when returning from details', async () => {
  fetchMovies.mockResolvedValueOnce({ Search: movies, totalResults: '2' }).mockResolvedValueOnce({ ...movies[1], Plot: 'A memorable adventure.', Actors: 'Example actor', imdbRating: '8.5' });
  render(<App />);
  search();
  await screen.findByRole('heading', { name: 'Zulu' });
  expect(fetchMovies).toHaveBeenCalledWith({ s: 'test', type: 'movie', page: '1' }, expect.any(AbortSignal));
  for (const [sort, expected] of [['az', ['Alpha', 'Zulu']], ['za', ['Zulu', 'Alpha']], ['newest', ['Alpha', 'Zulu']], ['oldest', ['Zulu', 'Alpha']]]) {
    userEvent.selectOptions(screen.getByLabelText('Sort by'), sort);
    expect(titles()).toEqual(expected);
  }
  userEvent.click(screen.getByRole('link', { name: /Alpha/ }));
  await screen.findByText('A memorable adventure.');
  expect(fetchMovies).toHaveBeenLastCalledWith({ i: 'tt002', plot: 'full' }, expect.any(AbortSignal));
  userEvent.click(screen.getByRole('link', { name: /Back to movies/ }));
  expect(titles()).toEqual(['Zulu', 'Alpha']);
  expect(screen.getByLabelText('Sort by')).toHaveValue('oldest');
  expect(fetchMovies).toHaveBeenCalledTimes(2);
});

test('shows skeletons while pending and an empty state for no matches', async () => {
  let resolve;
  fetchMovies.mockImplementation(() => new Promise(done => { resolve = done; }));
  render(<App />);
  search('missing');
  expect(screen.getByRole('status', { name: 'Loading movies' })).toBeInTheDocument();
  resolve({ Search: [], totalResults: '0' });
  await screen.findByRole('heading', { name: 'No movies found' });
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('recovers from search errors and paginates', async () => {
  fetchMovies.mockRejectedValueOnce(new Error('Service unavailable')).mockResolvedValueOnce({ Search: movies, totalResults: '12' }).mockResolvedValueOnce({ Search: [{ ...movies[0], Title: 'Page two' }], totalResults: '12' });
  render(<App />);
  search();
  expect(await screen.findByRole('alert')).toHaveTextContent('Service unavailable');
  userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await screen.findByText('Page 1 of 2');
  userEvent.click(screen.getByRole('button', { name: /Next/ }));
  await screen.findByRole('heading', { name: 'Page two' });
  expect(fetchMovies).toHaveBeenLastCalledWith({ s: 'test', type: 'movie', page: '2' }, expect.any(AbortSignal));
  expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled();
});

test('ignores outdated search responses', async () => {
  let resolveOld;
  fetchMovies.mockImplementationOnce(() => new Promise(done => { resolveOld = done; })).mockResolvedValueOnce({ Search: movies, totalResults: '2' });
  render(<App />);
  search('old');
  userEvent.clear(screen.getByRole('searchbox'));
  search('new');
  await screen.findByRole('heading', { name: 'Alpha' });
  resolveOld({ Search: [{ ...movies[0], Title: 'Stale result' }], totalResults: '1' });
  await waitFor(() => expect(screen.queryByText('Stale result')).not.toBeInTheDocument());
  expect(screen.getByRole('heading', { name: 'Alpha' })).toBeInTheDocument();
});

test('supports direct detail links and a safe return to home', async () => {
  window.history.replaceState({}, '', '/movies/tt001');
  fetchMovies.mockRejectedValueOnce(new Error('Movie not found!'));
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Movie not found!');
  userEvent.click(screen.getByRole('link', { name: /Back to movies/ }));
  expect(screen.getByRole('heading', { name: /What are you in the mood/ })).toBeInTheDocument();
});
