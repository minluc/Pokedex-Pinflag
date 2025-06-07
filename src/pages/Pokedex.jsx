import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFavorites, toggleFavorite as toggleFavoriteHelper } from '../services/favorites';
import axios from 'axios';
import Header from '../components/Header';
import './Pokedex.css';

function Pokedex() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        setPokemon(pokeRes.data);
        setSpecies(speciesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name]);

  const toggleFavorite = () => {
    const updated = toggleFavoriteHelper(name);
    setFavorites(updated);
  };

  if (loading || !pokemon || !species) {
    return (
      <div className="pokedex-loading">
        <div className="loading-spinner"></div>
        <p>Search Pokémon...</p>
      </div>
    );
  }

  const descriptionEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'es' || entry.language.name === 'en'
  );
  const description = descriptionEntry?.flavor_text?.replace(/\f/g, ' ') || 'Descripción no disponible';

  return (
    <>
      <Header />
      <div className="pokedex-page-wrapper">
        <div className="pokedex-main-container single-column">
          <div className="pokedex-right">
            <div className="pokemon-header">
              <div className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</div>
              <h1 className="pokemon-name">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h1>
            </div>

            <div className="sprite-container">
              <img
                src={
                  pokemon.sprites.versions['generation-v']['black-white'].animated.front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="pokedex-sprite"
              />
            </div>

            {/* Botón de favoritos movido aquí */}
            <div className="favorite-wrapper">
              <button
                className="favorite-button"
                onClick={toggleFavorite}
                aria-label="Toggle favorite"
              >
                <span className="favorite-icon">
                  {favorites.includes(name) ? '❤️' : '🤍'}
                </span>
              </button>
            </div>

            <div className="pokemon-info">
              <p className="pokedex-description">{description}</p>

              <div className="info-grid horizontal">
                <div className="info-item">
                  <span className="info-label">Tipo(s):</span>
                  <div className="types-container">
                    {pokemon.types.map((t, index) => (
                      <span key={index} className={`type-badge type-${t.type.name}`}>
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Peso:</span>
                  <span className="info-value">{pokemon.weight / 10} kg</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Altura:</span>
                  <span className="info-value">{pokemon.height / 10} m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pokedex-back-container">
          <button className="back-button" onClick={() => navigate('/pokemons')}>
            <span className="back-arrow">←</span>
            Return to the Pokédex
          </button>
        </div>
      </div>
    </>
  );
}

export default Pokedex;
