import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AUTH_CREDENTIALS } from '../../core'
import { saveSession, isAuthenticated } from '../../data'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated()) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    if (
      email.trim() === AUTH_CREDENTIALS.username &&
      password === AUTH_CREDENTIALS.password
    ) {
      saveSession()
      navigate(from, { replace: true })
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              Cine<span className="text-purple-500">View</span>
            </h1>
            <p className="text-white/50 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
            >
              Sign In
            </button>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-6">
          © 2024 CineView. All rights reserved.
        </p>

      </div>
    </div>
  )
}

export default LoginPage