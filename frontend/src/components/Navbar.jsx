import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Navbar — fixed top navigation bar
 * Shows different links based on authentication state.
 * Authenticated: Home, Write, My Posts, Profile, Logout
 * Guest: Home, Login, Register
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  // First letter of username as avatar
  const initials = user?.username?.[0]?.toUpperCase() || '?'

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" id="navbar-brand">
          ✍️ BlogSphere
        </Link>

        {/* Navigation links */}
        <ul className="navbar-links">
          <li>
            <Link to="/" className={isActive('/')} id="nav-home">Home</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/create" className={isActive('/create')} id="nav-write">
                  ✏️ Write
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className={isActive('/my-posts')} id="nav-my-posts">
                  My Posts
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile')} id="nav-profile">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="avatar" style={{ width: 26, height: 26, fontSize: '0.7rem' }}>
                      {initials}
                    </span>
                    {user.username}
                  </span>
                </Link>
              </li>
              <li>
                <button
                  id="nav-logout"
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                  style={{ marginLeft: '0.25rem' }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={isActive('/login')} id="nav-login">Login</Link>
              </li>
              <li>
                <Link to="/register" id="nav-register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
