import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [form, setForm]   = useState({ email: '', password: '' })
  const [show, setShow]   = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user }   = useAuth()
  const navigate          = useNavigate()
  const [params]          = useSearchParams()

  useEffect(() => {
    if (user) navigate('/home')
    // Google OAuth token in URL
    const token = params.get('token')
    if (token) { login(token); navigate('/home') }
    if (params.get('error') === 'google') setError('Google login failed. Try again.')
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/auth/login', form)
      if (res.data.requires2FA) {
        navigate('/verify-2fa', { state: { email: form.email, method: res.data.method } })
        return
      }
      login(res.data.token)
      navigate('/home')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      if (err.response?.data?.needsVerification) {
        navigate('/verify-email', { state: { email: form.email } })
        return
      }
      setError(msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">📝 Notewave</h1>
          <p className="text-gray-500 text-sm">Your thoughts, organized.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Welcome back</h2>

          {/* Google Login */}
          <a
            href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 transition mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600"
                placeholder="you@email.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white transition text-sm">
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="text-right -mt-2">
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">Forgot password?</Link>
            </div>

            {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed mt-1">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-500">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
