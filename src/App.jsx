import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import PokeGrid from './pages/Pokegrid';
import Pokedex from './pages/Pokedex';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pokemons" element={<PokeGrid />} />
        <Route path="/pokemon/:name" element={<Pokedex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

