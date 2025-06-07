import axios from 'axios';

export async function fetchPokemonList(limit = 30, offset = 0) {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const details = await Promise.all(
    data.results.map(p => axios.get(p.url).then(res => res.data))
  );
  return details;
}
