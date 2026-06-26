import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../Movies/ui/HomePage'
import LoginPage from '../Auth/ui/LoginPage'

describe('Smoke Tests', () => {
  it('renders the Home page', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('Home Page')).toBeDefined()
  })

  it('renders the Login page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Login Page')).toBeDefined()
  })
})