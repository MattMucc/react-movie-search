# React Movie Search

A bootcamp movie discovery project built with React and React Router. Includes OMDb title search, movie details, four sorting options, skeleton loading states, pagination, and responsive layouts.

## Run locally

1. Run `npm install`.
2. Get and activate an API key from https://www.omdbapi.com/apikey.aspx.
3. Copy `.env.example` to `.env.local` and replace the placeholder with your key:

   ```env
   REACT_APP_OMDB_API_KEY=your_actual_key
   ```

4. Run `npm start` and open http://localhost:3000.
5. Restart the development server whenever you change `.env.local`.

It does not substitute fake results for live searches. `.env.local` is ignored by Git. Create React App embeds environment values in the browser bundle; this key is visible to visitors. A production app requiring a private credential should call OMDb through a server.

## How the pieces fit together

- `src/App.jsx`: routes for `/` and `/movies/:id`.
- `src/components/Layout.jsx`: shared navigation, footer, and search/sort state. It stays mounted across routes so Back to movies restores the displayed results.
- `src/components/Nav.jsx`: search form and fetching with cancellation to prevent old requests overwriting new results.
- `src/pages/Home.jsx`: sorting, results grid, loading/error/empty states, and pagination.
- `src/components/MovieCard.jsx`: accessible movie links, poster fallbacks, and skeleton cards.
- `src/pages/MovieDetails.jsx`: reads `id` with `useParams`, requests full details, and displays plot, cast, rating, awards, and more.
- `src/api/omdb.js`: shared OMDb request and error handling.
- `src/index.css`: responsive layout and styling.

Search sends `s=<title>&type=movie&page=<page>`. Details sends `i=<imdbID>&plot=full`. Sort options operate on the current page (up to ten results), as labeled in the UI. Pagination supports OMDb's maximum of 100 pages. Search state is retained during navigation, but resets on a full browser refresh.

The app uses the supplied course index.css, movie background, and FES logo. The additional hero and framework assets are retained in src/assets for reference. The starting folder contained a users/posts exercise rather than the original movie site. The unused Posts component and HTML exercise files remain as references; active routes now use the movie components.

## Check your work

- `npm test -- --watchAll=false`: automated search, sorting, loading, empty/error, retry, pagination, stale-request, and detail/back-navigation checks with mocked API responses.
- `npm run build`: production bundle in `build/`.
- With your key configured, search for Batman, open a movie, then return to the results. Try all four sorts and page controls. Check the layout at desktop, tablet, and phone widths.

## Deployment

Deploy the `build/` directory to a static host. Set `REACT_APP_OMDB_API_KEY` in its build environment. Configure an SPA fallback to `index.html` so direct `/movies/:id` links work. `vercel.json` includes this rewrite for Vercel.
