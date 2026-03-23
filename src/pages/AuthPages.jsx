import { useState, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'

// ── Reusable OTP Input ───────────────────────────────────────────────
const OTPInput = ({ value, onChange }) => {
  const inputs = useRef([])
  const digits = value.split('')

  const handleKey = (e, i) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1].focus()
  }

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/, '')
    if (!val) {
      const next = [...digits]
      next[i] = ''
      onChange(next.join(''))
      return
    }
    const next = [...digits]
    next[i] = val[val.length - 1]
    onChange(next.join(''))
    if (i < 5 && val) inputs.current[i + 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted.padEnd(6, '').slice(0, 6))
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center">
      {[0,1,2,3,4,5].map(i => (
        <input key={i}
          ref={el => inputs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-indigo-500 transition"
        />
      ))}
    </div>
  )
}

// ── Verify Email ─────────────────────────────────────────────────────
export const VerifyEmail = () => {
  const [otp, setOtp]     = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent]   = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()
  const email = state?.email

  const handleVerify = async () => {
    if (otp.length < 6) return setError('Enter complete 6-digit OTP')
    setLoading(true)
    try {
      await API.post('/auth/verify-email', { email, otp })
      navigate('/login', { state: { verified: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    try {
      await API.post('/auth/resend-otp', { email })
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch (err) { setError('Failed to resend OTP') }
  }

  return <OTPPage
    title="Verify your email"
    subtitle={`We sent a 6-digit OTP to ${email}`}
    otp={otp} setOtp={setOtp} error={error} loading={loading}
    onSubmit={handleVerify} submitLabel="Verify Email"
    footer={<p className="text-gray-500 text-sm text-center mt-4">
      Didn't receive it?{' '}
      <button onClick={handleResend} className="text-indigo-400 hover:underline">Resend OTP</button>
      {resent && <span className="text-green-400 ml-2">Sent!</span>}
    </p>}
  />
}

// ── Verify 2FA ───────────────────────────────────────────────────────
export const Verify2FA = () => {
  const [otp, setOtp]     = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()
  const { login } = useAuth()
  const email  = state?.email
  const method = state?.method

  const handleVerify = async () => {
    if (otp.length < 6) return setError('Enter complete 6-digit code')
    setLoading(true)
    try {
      const res = await API.post('/auth/verify-2fa', { email, otp, method })
      login(res.data.token)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code')
    } finally { setLoading(false) }
  }

  return <OTPPage
    title="Two-Factor Authentication"
    subtitle={method === 'totp'
      ? 'Enter the code from your authenticator app'
      : `Enter the OTP sent to ${email}`}
    otp={otp} setOtp={setOtp} error={error} loading={loading}
    onSubmit={handleVerify} submitLabel="Verify"
  />
}

// ── Forgot Password ──────────────────────────────────────────────────
export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally { setLoading(false) }
  }

  if (sent) return <ResetPassword email={email} />

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">📝 Notewave</h1>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <Link to="/login" className="text-gray-500 text-sm hover:text-white transition flex items-center gap-1 mb-4">← Back to login</Link>
          <h2 className="text-2xl font-semibold text-white mb-2">Forgot password</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send a reset OTP.</p>
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="you@email.com" required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600" />
            {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Reset Password ───────────────────────────────────────────────────
const ResetPassword = ({ email: propEmail }) => {
  const [form, setForm]   = useState({ otp: '', newPassword: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirm) return setError('Passwords do not match')
    if (form.newPassword.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      await API.post('/auth/reset-password', {
        email: propEmail,
        otp: form.otp,
        newPassword: form.newPassword
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">📝 Notewave</h1>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Reset password</h2>
          <p className="text-gray-500 text-sm mb-6">Enter the OTP sent to <span className="text-indigo-400">{propEmail}</span></p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { label: 'OTP', name: 'otp', type: 'text', placeholder: '6-digit OTP' },
              { label: 'New Password', name: 'newPassword', type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', name: 'confirm', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]}
                  onChange={e => { setForm({...form, [e.target.name]: e.target.value}); setError('') }}
                  placeholder={f.placeholder} required
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition placeholder-gray-600" />
              </div>
            ))}
            {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Shared OTP Page layout ───────────────────────────────────────────
const OTPPage = ({ title, subtitle, otp, setOtp, error, loading, onSubmit, submitLabel, footer }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-1">📝 Notewave</h1>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <OTPInput value={otp} onChange={setOtp} />
        {error && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg mt-4 text-center">{error}</p>}
        <button onClick={onSubmit} disabled={loading || otp.length < 6}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50 mt-6">
          {loading ? 'Verifying...' : submitLabel}
        </button>
        {footer}
      </div>
    </div>
  </div>
)

export default ForgotPassword
