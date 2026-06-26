import { SESSION_KEY } from '../core'

export const getSession = (): string | null => {
  return sessionStorage.getItem(SESSION_KEY)
}

export const saveSession = (): void => {
  sessionStorage.setItem(SESSION_KEY, 'active')
}

export const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY)
}

export const isAuthenticated = (): boolean => {
  return getSession() !== null
}