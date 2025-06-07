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

  if (loading || !pokemon || !species) return <div className="pokedex-loading">Cargando...</div>;

  const descriptionEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'es' || entry.language.name === 'en'
  );
  const description = descriptionEntry?.flavor_text?.replace(/\f/g, ' ') || 'Descripción no disponible';

  return (
    <>
      <Header />

      <div className="pokedex-page-wrapper">
        <div className="pokedex-main-container">
          <div className="pokedex-left">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt="Artwork"
              className="pokedex-artwork"
            />
            <button className="favorite-button" onClick={toggleFavorite} aria-label="Toggle favorite">
              {favorites.includes(name) ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="pokedex-right">
            <h1>
              #{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h1>
            <img
              src={
                pokemon.sprites.versions['generation-v']['black-white'].animated.front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              className="pokedex-sprite"
            />
            <p className="pokedex-description">{description}</p>
            <p><strong>Tipo(s):</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Peso (WT):</strong> {pokemon.weight / 10} kg</p>
            <p><strong>Altura (HT):</strong> {pokemon.height / 10} m</p>
          </div>
        </div>

        <div className="pokedex-back-container">
          <button className="back-button" onClick={() => navigate('/pokemons')}>← Volver</button>
        </div>
      </div>
    </>
  );
}

export default Pokedex;


