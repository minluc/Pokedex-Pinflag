import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import PokeGrid from '../pages/Pokegrid'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

vi.mock('axios')
vi.mock('../services/api', () => ({
  fetchPokemonList: vi.fn(() => Promise.resolve([
    {
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
      sprites: { front_default: 'bulbasaur.png' }
    },
    {
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
      sprites: { front_default: 'pikachu.png' }
    }
  ]))
}))

vi.mock('../services/favorites', () => ({
  getFavorites: vi.fn(() => []),
  toggleFavorite: vi.fn(() => ['pikachu'])
}))

vi.mock('../components/Header', () => ({
  default: ({ search, onSearchChange, onTypeChange, showFavorites, onToggleFavorites }) => (
    <div data-testid="header">
      <input 
        data-testid="search-input" 
        value={search} 
        onChange={(e) => onSearchChange(e.target.value)} 
      />
      <select data-testid="type-filter" onChange={(e) => onTypeChange(e.target.value)}>
        <option value="">All Types</option>
        <option value="electric">Electric</option>
      </select>
      <button data-testid="favorites-toggle" onClick={onToggleFavorites}>
        {showFavorites ? 'Show All' : 'Show Favorites'}
      </button>
    </div>
  )
}))

vi.mock('../components/PokemonCard', () => ({
  default: ({ name, onClick, onToggleFavorite, isFavorite }) => (
    <div data-testid={`pokemon-card-${name}`} onClick={onClick}>
      <span>{name}</span>
      <button 
        data-testid={`favorite-btn-${name}`} 
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  )
}))

vi.mock('../components/SkeletonCard', () => ({
  default: () => <div data-testid="skeleton-card">Loading...</div>
}))

describe('PokeGrid Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows skeleton cards while loading', () => {
    render(<PokeGrid />)
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(30)
  })

  it('displays pokemon cards after loading', async () => {
    render(<PokeGrid />)
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument()
    })
    
    expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument()
  })

  it('filters pokemon by search term', async () => {
    render(<PokeGrid />)
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'pika' } })
    
    expect(screen.queryByTestId('pokemon-card-bulbasaur')).not.toBeInTheDocument()
    expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument()
  })

  it('filters pokemon by type', async () => {
    render(<PokeGrid />)
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument()
    })
    
    const typeFilter = screen.getByTestId('type-filter')
    fireEvent.change(typeFilter, { target: { value: 'electric' } })
    
    expect(screen.queryByTestId('pokemon-card-bulbasaur')).not.toBeInTheDocument()
    expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument()
  })

  it('navigates to pokemon detail on card click', async () => {
    render(<PokeGrid />)
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByTestId('pokemon-card-pikachu'))
    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/pikachu')
  })

  it('handles pagination', async () => {
    render(<PokeGrid />)
    
    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument()
    })
    
    const nextBtn = screen.getByText('▶')
    expect(nextBtn).toBeInTheDocument()
    
    const prevBtn = screen.getByText('◀')
    expect(prevBtn).toBeInTheDocument()
  })

  it('toggles favorite status', async () => {
    const { toggleFavorite } = await import('../services/favorites')
    
    render(<PokeGrid />)
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument()
    })
    
    const favoriteBtn = screen.getByTestId('favorite-btn-pikachu')
    fireEvent.click(favoriteBtn)
    
    expect(toggleFavorite).toHaveBeenCalledWith('pikachu')
  })
})
