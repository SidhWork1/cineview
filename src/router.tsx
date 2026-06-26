import { createBrowserRouter } from 'react-router-dom'
import HomePage from './Movies/ui/HomePage'
import MovieDetailPage from './Movies/ui/MovieDetailPage'
import TVShowDetailPage from './TVShows/ui/TVShowDetailPage'
import SeasonDetailPage from './TVShows/ui/SeasonDetailPage'
import SearchPage from './Search/ui/SearchPage'
import WatchlistPage from './Collection/ui/WatchlistPage'
import MyListsPage from './Collection/ui/MyListsPage'
import ListDetailPage from './Collection/ui/ListDetailPage'
import SettingsPage from './Preferences/ui/SettingsPage'
import LoginPage from './Auth/ui/LoginPage'

const NotFoundPage = () => (
  <div style={{ color: 'white', padding: '2rem' }}>
    <h1>404 — Page Not Found</h1>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/movies/:id',
    element: <MovieDetailPage />,
  },
  {
    path: '/tv/:id',
    element: <TVShowDetailPage />,
  },
  {
    path: '/tv/:id/season/:seasonNumber',
    element: <SeasonDetailPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/watchlist',
    element: <WatchlistPage />,
  },
  {
    path: '/lists',
    element: <MyListsPage />,
  },
  {
    path: '/lists/:id',
    element: <ListDetailPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router