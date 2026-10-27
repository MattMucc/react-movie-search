import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
export default function App() {
  return <HashRouter><Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="movies/:id" element={<MovieDetails />} /><Route path="*" element={<div className="empty-state"><h1>Page not found</h1><Link to="/">Back to movies</Link></div>} /></Route></Routes></HashRouter>;
}

