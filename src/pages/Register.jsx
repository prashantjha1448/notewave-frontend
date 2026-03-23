import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../utils/api'

const Register = () => {
  const [form, setForm]   = useState({ userName: '', email: '', password: '', confirm: '' })
  const [show, setShow]   = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate          = useNavigate()

  const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/

  const getStrength = () => {
    let s = 0
    if (form.password.length >= 6) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/\d/.test(form.password)) s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    return s
  }
  const strength = getStrength()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.userName.length < 3) return setError('Username must be at least 3 characters')
    if (!emailRegex.test(form.email)) return setError('Invalid email address')
    if (!passwordRegex.test(form.password)) return setError('Password needs 6+ chars, 1 uppercase, 1 number')
    if (form.password !== form.confirm) return setError('Passwords do not match')

    setLoading(true)
    try {
      await API.post('/auth/register', {
        userName: form.userName,
        email: form.email,
        password: form.password
      })
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">📝 Notewave</h1>
          <p className="text-gray-500 text-sm">Your thoughts, organized.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Create account</h2>

          <a href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 transition mb-6">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { label: 'Username', name: 'userName', type: 'text', placeholder: 'cooluser123' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@email.com' },
            ].map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]}
                  onChange={handleChange} required placeholder={f.placeholder}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600" />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required placeholder="Min 6 chars, 1 upper, 1 number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white transition text-sm">
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <span className={`text-xs ${strengthColor[strength].replace('bg-', 'text-')}`}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm}
                onChange={handleChange} required placeholder="••••••••"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600" />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50 mt-1">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
