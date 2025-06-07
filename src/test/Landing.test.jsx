import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Landing from '../pages/Landing'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

vi.mock('../components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>
}))

describe('Landing Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders welcome message and start button', () => {
    render(<Landing />)
    expect(screen.getByText('Welcome to Pokedex!')).toBeInTheDocument()
    expect(screen.getByText('START')).toBeInTheDocument()
  })

  it('shows loader when start button is clicked', () => {
    render(<Landing />)
    fireEvent.click(screen.getByText('START'))
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('navigates to pokemons after delay', async () => {
    vi.useFakeTimers()
    render(<Landing />)
    fireEvent.click(screen.getByText('START'))

    vi.advanceTimersByTime(2000)

    expect(mockNavigate).toHaveBeenCalledWith('/pokemons')
    vi.useRealTimers()
  })

  it('displays pokemon images', () => {
    render(<Landing />)
    expect(screen.getByAltText('Pikachu waving')).toBeInTheDocument()
    expect(screen.getByAltText('Charmander')).toBeInTheDocument()
  })
})