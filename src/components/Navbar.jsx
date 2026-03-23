import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ searchData, setSearchData, notesCount }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.userName?.slice(0, 2).toUpperCase() || '??'

  return (
    <nav className="sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 px-5 sm:px-8 py-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link to="/home" className="text-xl font-bold text-white flex items-center gap-2 shrink-0">
          📝 <span className="text-indigo-400">Notewave</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <input
            value={searchData} onChange={e => setSearchData(e.target.value)}
            type="search" placeholder="Search notes..."
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500/50 transition placeholder-gray-600"
          />
        </div>

        {/* Notes count */}
        <span className="hidden sm:block text-sm text-gray-500 shrink-0">
          <span className="text-yellow-400 font-semibold">{notesCount}</span> notes
        </span>

        <div className="flex items-center gap-2 ml-auto">
          <Link to="/deleted"
            className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 hover:text-white px-3 py-2 rounded-xl text-xs transition hover:bg-white/10">
            🗑️ Trash
          </Link>
          <Link to="/profile"
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:bg-white/10 transition">
            {user?.profileImage
              ? <img src={user.profileImage} alt="" className="w-6 h-6 rounded-full object-cover" />
              : <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            }
            <span className="hidden sm:block text-gray-300 text-xs">{user?.userName}</span>
          </Link>
          <button onClick={handleLogout}
            className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-xl text-xs transition">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
