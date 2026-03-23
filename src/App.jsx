import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import DeletedNotes from './pages/DeletedNotes'
import Profile from './pages/Profile'
import { VerifyEmail, Verify2FA, ForgotPassword } from './pages/AuthPages'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-indigo-400 text-lg animate-pulse">Loading...</div>
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/home" /> : children
}

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/verify-email"   element={<VerifyEmail />} />
    <Route path="/verify-2fa"     element={<Verify2FA />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/auth/google"    element={<Login />} />
    <Route path="/home"           element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/deleted"        element={<ProtectedRoute><DeletedNotes /></ProtectedRoute>} />
    <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="*"               element={<Navigate to="/login" />} />
  </Routes>
)

export default App
