import { createBrowserRouter } from 'react-router-dom'
import ShellLayout from './Auth/ui/ShellLayout'
import ProtectedRoute from './Auth/ui/ProtectedRoute'
import LoginPage from './Auth/ui/LoginPage'
import HomePage from './Movies/ui/HomePage'
import MovieDetailPage from './Movies/ui/MovieDetailPage'
import TVShowDetailPage from './TVShows/ui/TVShowDetailPage'
import SeasonDetailPage from './TVShows/ui/SeasonDetailPage'
import SearchPage from './Search/ui/SearchPage'
import WatchlistPage from './Collection/ui/WatchlistPage'
import MyListsPage from './Collection/ui/MyListsPage'
import ListDetailPage from './Collection/ui/ListDetailPage'
import SettingsPage from './Preferences/ui/SettingsPage'

const NotFoundPage = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-white/50 mb-6">Page not found</p>
      <a href="/" className="text-purple-500 hover:text-purple-400 transition-colors">
        Go Home
      </a>
    </div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ShellLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'movies/:id',
        element: <MovieDetailPage />,
      },
      {
        path: 'tv/:id',
        element: <TVShowDetailPage />,
        children: [
          {
            path: 'season/:seasonNumber',
            element: <SeasonDetailPage />,
          },
        ],
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'watchlist',
        element: <WatchlistPage />,
      },
      {
        path: 'lists',
        element: <MyListsPage />,
      },
      {
        path: 'lists/:id',
        element: <ListDetailPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router