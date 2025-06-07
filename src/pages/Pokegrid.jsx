import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPokemonList } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import SkeletonCard from '../components/SkeletonCard';
import Header from '../components/Header';
import './PokeGrid.css';
import axios from 'axios';
import {
  getFavorites,
  toggleFavorite as toggleFavoriteHelper
} from '../services/favorites';

function PokeGrid() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('');
  const [generationFilter, setGenerationFilter] = useState('');
  const [generationPokemonNames, setGenerationPokemonNames] = useState([]);

  const navigate = useNavigate();
  const pageSize = 30;

  useEffect(() => {
    setLoading(true);
    fetchPokemonList(1000, 0).then((data) => {
      setPokemons(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    if (!generationFilter) {
      setGenerationPokemonNames([]);
      return;
    }

    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/generation/${generationFilter}`)
      .then((res) => {
        const names = res.data.pokemon_species.map((p) => p.name.toLowerCase());
        setGenerationPokemonNames(names);
      })
      .finally(() => setLoading(false));
  }, [generationFilter]);

  const toggleFavorite = (name) => {
    const updated = toggleFavoriteHelper(name);
    setFavorites(updated);
  };

  const filtered = pokemons.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = !showFavorites || favorites.includes(p.name);
    const matchesType =
      !typeFilter || p.types.some((t) => t.type.name === typeFilter);
    const matchesGeneration =
      !generationFilter || generationPokemonNames.includes(p.name.toLowerCase());

    return matchesName && matchesFavorite && matchesType && matchesGeneration;
  });

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    const maxPage = Math.floor(filtered.length / pageSize);
    if (page > maxPage) setPage(0);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [page]);

  return (
    <div className="pokegrid-container">
      <Header
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(0);
        }}
        onTypeChange={(val) => {
          setTypeFilter(val);
          setPage(0);
        }}
        onGenerationChange={(val) => {
          setGenerationFilter(val);
          setPage(0);
        }}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
      />

      {loading ? (
        <div className="pokegrid-grid">
          {Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="pokegrid-grid">
          {paginated.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              name={pokemon.name}
              image={pokemon.sprites.front_default}
              isFavorite={favorites.includes(pokemon.name)}
              onClick={() => navigate(`/pokemon/${pokemon.name}`)}
              onToggleFavorite={() => toggleFavorite(pokemon.name)}
            />
          ))}
        </div>
      )}

      <div className="pokegrid-pagination">
        <button className="pagination-button" onClick={() => setPage(0)}>
          ⏮ Inicio
        </button>

        <button className="pagination-button" onClick={() => setPage(Math.max(0, page - 1))}>
          ◀ Anterior
        </button>

        <span className="pagination-page">Página {page + 1}</span>

        <button className="pagination-button" onClick={() => {
          if ((page + 1) * pageSize < filtered.length) {
            setPage(page + 1);
          }
        }}>
          Siguiente ▶
        </button>

        <button className="pagination-button" onClick={() => {
          const lastPage = Math.floor((filtered.length - 1) / pageSize);
          setPage(lastPage);
        }}>
          Final ⏭
        </button>
      </div>
    </div>
  );
}

export default PokeGrid;

