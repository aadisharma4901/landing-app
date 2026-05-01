import { render, screen } from '@testing-library/react'
import Features from './Features'

describe('Features', () => {
  test('should render features section', () => {
    render(<Features />)
    
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  test('should have all feature cards', () => {
    render(<Features />)
    
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.length).toBe(4)
  })
})