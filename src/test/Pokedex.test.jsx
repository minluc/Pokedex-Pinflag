import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import Pokedex from '../pages/Pokedex'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ name: 'pikachu' })
  }
})

vi.mock('axios')
vi.mock('../services/favorites', () => ({
  getFavorites: vi.fn(() => []),
  toggleFavorite: vi.fn(() => ['pikachu'])
}))

vi.mock('../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}))

const mockPokemonData = {
  id: 25,
  name: 'pikachu',
  weight: 60,
  height: 4,
  types: [{ type: { name: 'electric' } }],
  sprites: {
    front_default: 'pikachu.png',
    versions: {
      'generation-v': {
        'black-white': {
          animated: {
            front_default: 'pikachu-animated.gif'
          }
        }
      }
    }
  }
}

const mockSpeciesData = {
  flavor_text_entries: [
    {
      flavor_text: 'Electric mouse Pokemon',
      language: { name: 'en' }
    }
  ]
}

describe('Pokedex Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: mockPokemonData })
  })

  it('shows loading state initially', () => {
    render(<Pokedex />)
    expect(screen.getByText('Search Pokémon...')).toBeInTheDocument()
  })

  it('displays pokemon data after loading', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      return Promise.resolve({ data: mockPokemonData })
    })

    render(<Pokedex />)
    
    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument()
    })
    
    expect(screen.getByText('#025')).toBeInTheDocument()
    expect(screen.getByText('6 kg')).toBeInTheDocument()
    expect(screen.getByText('0.4 m')).toBeInTheDocument()
  })

  it('toggles favorite status', async () => {
    const { toggleFavorite } = await import('../services/favorites')
    
    axios.get.mockImplementation((url) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      return Promise.resolve({ data: mockPokemonData })
    })

    render(<Pokedex />)
    
    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument()
    })
    
    const favoriteBtn = screen.getByLabelText('Toggle favorite')
    fireEvent.click(favoriteBtn)
    
    expect(toggleFavorite).toHaveBeenCalledWith('pikachu')
  })

  it('navigates back to pokemon list', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('pokemon-species')) {
        return Promise.resolve({ data: mockSpeciesData })
      }
      return Promise.resolve({ data: mockPokemonData })
    })

    render(<Pokedex />)
    
    await waitFor(() => {
      expect(screen.getByText('Return to the Pokédex')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Return to the Pokédex'))
    expect(mockNavigate).toHaveBeenCalledWith('/pokemons')
  })
})