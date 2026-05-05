import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

/**
 * MyPosts Page — /my-posts
 *
 * Shows the logged-in user's own posts in a list.
 * Each row has Edit and Delete buttons.
 * Uses GET /api/my-posts/ (filtered by author on the backend).
 */
export default function MyPosts() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    api.get('/api/my-posts/')
      .then((r) => setPosts(r.data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/api/posts/${id}/`)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 760 }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Posts</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Manage your published articles
            </p>
          </div>
          <Link to="/create" className="btn btn-primary" id="new-post-btn">
            ✏️ New Post
          </Link>
        </div>

        {/* Post list */}
        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : posts.length === 0 ? (
          <div className="empty-state" id="my-posts-empty">
            <div className="icon">📝</div>
            <h3>No posts yet</h3>
            <p>Write your first post and share it with the world!</p>
            <Link to="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Write Now →
            </Link>
          </div>
        ) : (
          <div id="my-posts-list">
            {posts.map((post) => {
              const date = new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })

              return (
                <div
                  key={post.id}
                  id={`my-post-${post.id}`}
                  className="card"
                  style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'default' }}
                >
                  {/* Post info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      {post.category && (
                        <span className="post-card-category">{post.category.name}</span>
                      )}
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{date}</span>
                    </div>
                    <h3
                      style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', cursor: 'pointer' }}
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      {post.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>❤️ {post.total_likes} likes</span>
                      <span>💬 {post.comments?.length || 0} comments</span>
                    </div>
                    {post.tags && (
                      <div className="tags" style={{ marginTop: '0.4rem' }}>
                        {post.tags.split(',').map((t, i) => (
                          <span key={i} className="tag">#{t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link
                      to={`/edit/${post.id}`}
                      className="btn btn-outline btn-sm"
                      id={`edit-${post.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      id={`delete-${post.id}`}
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                    >
                      {deletingId === post.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
