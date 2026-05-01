import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  test('should render hero section correctly', () => {
    render(<Hero />)
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/Premium Electronics/i)).toBeInTheDocument()
  })

  test('should have shop now button', () => {
    render(<Hero />)
    
    expect(screen.getByRole('link', { name: /Shop Now/i })).toBeInTheDocument()
  })

  test('should have view deals button', () => {
    render(<Hero />)
    
    expect(screen.getByRole('link', { name: /View Deals/i })).toBeInTheDocument()
  })
})