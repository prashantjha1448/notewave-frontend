import { createContext, useContext, useState, useEffect } from 'react'
import API from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) fetchProfile()
    else setLoading(false)
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await API.get('/user/profile')
      setUser(res.data)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = (token) => {
    localStorage.setItem('token', token)
    fetchProfile()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }))

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
