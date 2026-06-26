import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../Auth/ui/LoginPage'

describe('Milestone 2 — Auth Smoke Tests', () => {
  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('name@example.com')).toBeDefined()
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined()
  })

  it('shows error when submitting empty form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Sign In'))
    expect(screen.getByText('Please enter both email and password.')).toBeDefined()
  })

  it('shows error for wrong credentials', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'wrong@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpassword' },
    })
    fireEvent.click(screen.getByText('Sign In'))
    expect(screen.getByText('Invalid email or password. Please try again.')).toBeDefined()
  })
})