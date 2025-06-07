import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/Logo.png';
import axios from 'axios';

function Header({
  search,
  onSearchChange,
  onTypeChange,
  onGenerationChange,
  showFavorites,
  onToggleFavorites,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const isPokedexPage = location.pathname.startsWith('/pokemon/');

  const [types, setTypes] = useState([]);
  const [generations, setGenerations] = useState([]);

  useEffect(() => {
    if (!isPokedexPage) {
      axios.get('https://pokeapi.co/api/v2/type').then((res) => {
        setTypes(res.data.results.filter(t => t.name !== 'shadow' && t.name !== 'unknown'));
      });
      axios.get('https://pokeapi.co/api/v2/generation').then((res) => {
        setGenerations(res.data.results);
      });
    }
  }, [isPokedexPage]);

  return (
    <header className="header-container">
      <div className="logo-section" onClick={() => navigate('/')}>
        <img
          src={logo}
          alt="Logo Pokémon"
          className="header-logo"
          style={{ cursor: 'pointer' }}
        />
      </div>

      {!isPokedexPage && (
        <>
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="header-search"
          />

          <select onChange={(e) => onTypeChange(e.target.value)} className="header-select">
            <option value="">Type</option>
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>

          <select onChange={(e) => onGenerationChange(e.target.value)} className="header-select">
            <option value="">Generation</option>
            {generations.map((gen, index) => (
              <option key={gen.name} value={index + 1}>
                Gen {index + 1}
              </option>
            ))}
          </select>

          <button onClick={onToggleFavorites} className="favorites-button">
            {showFavorites ? 'Todos' : '❤️ Favoritos'}
          </button>
        </>
      )}
    </header>
  );
}

export default Header;
