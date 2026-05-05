import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

/**
 * Profile Page — /profile
 *
 * Shows the logged-in user's profile and allows them to update:
 *   - Bio (text area)
 *   - Profile picture (image upload)
 *
 * Uses GET /api/profile/ to load and PUT /api/profile/ to update.
 */
export default function Profile() {
  const { user, login } = useAuth()
  const [bio, setBio] = useState(user?.bio || '')
  const [profilePic, setProfilePic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const data = new FormData()
      data.append('bio', bio)
      if (profilePic) data.append('profile_pic', profilePic)

      await api.put('/api/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('Profile updated successfully!')
    } catch {
      setError('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.username?.[0]?.toUpperCase() || '?'

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>

        {/* Profile header */}
        <div className="card" style={{ marginBottom: '1.5rem' }} id="profile-header">
          <div className="profile-header">
            {user?.profile_pic ? (
              <img
                src={`http://localhost:8000${user.profile_pic}`}
                alt="Profile"
                className="avatar avatar-lg"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <span className="avatar avatar-lg">{initials}</span>
            )}
            <div className="profile-info">
              <h2>{user?.username}</h2>
              <p>{user?.email}</p>
              <span className="role-badge">{user?.role}</span>
              {user?.bio && (
                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card" id="profile-edit-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Edit Profile
          </h3>

          {success && <div className="alert alert-success" id="profile-success">{success}</div>}
          {error && <div className="alert alert-error" id="profile-error">{error}</div>}

          <form onSubmit={handleSubmit} id="profile-form">
            <div className="form-group">
              <label htmlFor="profile-bio">Bio</label>
              <textarea
                className="form-control"
                id="profile-bio"
                placeholder="Tell readers a bit about yourself…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-pic">Profile Picture</label>
              <input
                className="form-control"
                id="profile-pic"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                style={{ padding: '0.5rem' }}
              />
            </div>

            <button
              id="profile-save"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="card" style={{ marginTop: '1rem' }} id="account-info">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Account Info</h3>
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Username', user?.username],
                ['Email', user?.email],
                ['Role', user?.role],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)', width: '120px' }}>{label}</td>
                  <td style={{ padding: '0.6rem 0', fontWeight: 600 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
