import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileRef  = useRef()

  const [userName, setUserName]     = useState(user?.userName || '')
  const [preview, setPreview]       = useState(user?.profileImage || null)
  const [imageFile, setImageFile]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const [msg, setMsg]               = useState({ text: '', type: '' })

  // 2FA states
  const [twoFATab, setTwoFATab]     = useState('email') // 'email' | 'totp'
  const [qrCode, setQrCode]         = useState(null)
  const [totpCode, setTotpCode]     = useState('')
  const [enabling2FA, setEnabling2FA] = useState(false)
  const [show2FASetup, setShow2FASetup] = useState(false)

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('userName', userName)
      if (imageFile) formData.append('profileImage', imageFile)
      const res = await API.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      updateUser(res.data.user)
      setImageFile(null)
      showMsg('Profile updated!')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Update failed', 'error')
    } finally { setSaving(false) }
  }

  // Setup TOTP — get QR code
  const handleSetupTOTP = async () => {
    try {
      const res = await API.get('/auth/setup-2fa')
      setQrCode(res.data.qrCode)
      setShow2FASetup(true)
    } catch (err) { showMsg('Failed to setup 2FA', 'error') }
  }

  // Enable 2FA
  const handleEnable2FA = async () => {
    setEnabling2FA(true)
    try {
      await API.post('/auth/enable-2fa', {
        method: twoFATab,
        otp: twoFATab === 'totp' ? totpCode : undefined
      })
      updateUser({ twoFactorEnabled: true, twoFactorMethod: twoFATab })
      setShow2FASetup(false)
      setTotpCode('')
      showMsg(`2FA enabled via ${twoFATab === 'totp' ? 'Authenticator App' : 'Email'}!`)
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to enable 2FA', 'error')
    } finally { setEnabling2FA(false) }
  }

  // Disable 2FA
  const handleDisable2FA = async () => {
    try {
      await API.post('/auth/disable-2fa')
      updateUser({ twoFactorEnabled: false, twoFactorMethod: 'none' })
      showMsg('2FA disabled.')
    } catch (err) { showMsg('Failed to disable 2FA', 'error') }
  }

  const initials = user?.userName?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/home')}
            className="text-gray-500 hover:text-white transition text-sm">← Back</button>
          <h1 className="text-xl font-semibold text-white">Profile</h1>
        </div>

        {/* Alert */}
        {msg.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
            msg.type === 'error'
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'bg-green-500/10 border border-green-500/20 text-green-400'
          }`}>{msg.text}</div>
        )}

        {/* Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Account Info</h2>

          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current.click()}>
              {preview
                ? <img src={preview} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-white/10" />
                : <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold border-2 border-white/10">{initials}</div>
              }
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <div>
              <p className="text-white font-semibold">{user?.userName}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              {user?.googleId && (
                <span className="text-xs bg-blue-500/15 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded-full mt-1 inline-block">Google account</span>
              )}
            </div>
          </div>

          {/* Username edit */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Username</label>
            <input value={userName} onChange={e => setUserName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60 transition" />
          </div>
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Email</label>
            <input value={user?.email || ''} readOnly
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed" />
          </div>

          <button onClick={handleSaveProfile} disabled={saving}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* 2FA Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Two-Factor Authentication</h2>
            {user?.twoFactorEnabled && (
              <span className="text-xs bg-green-500/15 border border-green-500/25 text-green-400 px-2.5 py-1 rounded-full font-medium">
                Enabled — {user.twoFactorMethod === 'totp' ? 'Authenticator App' : 'Email OTP'}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-5">Add an extra layer of security to your account.</p>

          {user?.twoFactorEnabled ? (
            <button onClick={handleDisable2FA}
              className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-semibold text-sm transition">
              Disable 2FA
            </button>
          ) : (
            <>
              {/* Method tabs */}
              <div className="flex gap-2 mb-4">
                {['email', 'totp'].map(tab => (
                  <button key={tab} onClick={() => { setTwoFATab(tab); setShow2FASetup(false); setQrCode(null) }}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition border ${
                      twoFATab === tab
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}>
                    {tab === 'email' ? '📧 Email OTP' : '📱 Authenticator App'}
                  </button>
                ))}
              </div>

              {twoFATab === 'email' ? (
                <div>
                  <p className="text-gray-500 text-sm mb-4">A one-time code will be sent to your email every time you log in.</p>
                  <button onClick={handleEnable2FA} disabled={enabling2FA}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50">
                    {enabling2FA ? 'Enabling...' : 'Enable Email 2FA'}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 text-sm mb-4">Use Google Authenticator or Authy to scan the QR code.</p>
                  {!show2FASetup ? (
                    <button onClick={handleSetupTOTP}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition">
                      Get QR Code
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      {qrCode && <img src={qrCode} alt="QR Code" className="w-44 h-44 rounded-xl bg-white p-2" />}
                      <p className="text-gray-500 text-xs text-center">Scan this with your authenticator app, then enter the 6-digit code below.</p>
                      <input value={totpCode} onChange={e => setTotpCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full text-center text-2xl tracking-widest bg-white/5 border border-white/15 rounded-xl py-3 outline-none focus:border-indigo-500 text-white"
                        maxLength={6}
                      />
                      <button onClick={handleEnable2FA} disabled={enabling2FA || totpCode.length < 6}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition disabled:opacity-50">
                        {enabling2FA ? 'Verifying...' : 'Confirm & Enable 2FA'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
