import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

/**
 * Register Page — /register
 *
 * Creates a new user account via POST /api/register/
 * then redirects to Login with a success message.
 * Role defaults to 'user'; 'author' can be selected to enable post creation.
 */
export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/api/register/', form)
      navigate('/login', { state: { message: 'Account created! Please sign in.' } })
    } catch (err) {
      const data = err.response?.data
      if (data) {
        // Flatten Django field errors into a readable string
        const messages = Object.entries(data)
          .map(([field, errs]) => `${field}: ${errs.join ? errs.join(', ') : errs}`)
          .join(' • ')
        setError(messages)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" id="register-card">
        <h2>Create Account 🚀</h2>
        <p className="subtitle">Join BlogSphere and start sharing your ideas</p>

        {error && (
          <div className="alert alert-error" id="register-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              className="form-control"
              id="reg-username"
              name="username"
              type="text"
              placeholder="choose_a_username"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              className="form-control"
              id="reg-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="password-wrapper">
              <input
                className="form-control"
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                id="toggle-reg-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-role">I want to…</label>
            <select
              className="form-control"
              id="reg-role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">Read & Comment (Reader)</option>
              <option value="author">Write Blog Posts (Author)</option>
            </select>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="go-login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
