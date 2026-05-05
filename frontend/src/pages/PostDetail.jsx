import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import CommentSection from '../components/CommentSection'

/**
 * PostDetail Page — /post/:id
 *
 * Shows the full blog post with:
 *  - Cover image, title, author, date, category, tags
 *  - Full content body
 *  - Like/Unlike button (toggle, shows live count)
 *  - Comment section
 *  - Edit / Delete buttons (author only)
 */
export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [likeLoading, setLikeLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/posts/${id}/`)
      .then((r) => setPost(r.data))
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    setLikeLoading(true)
    try {
      const res = await api.post(`/api/posts/${id}/like/`)
      setPost((p) => ({
        ...p,
        is_liked: res.data.liked,
        total_likes: res.data.total_likes
      }))
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setDeleteLoading(true)
    try {
      await api.delete(`/api/posts/${id}/`)
      navigate('/my-posts')
    } catch {
      alert('Failed to delete post.')
      setDeleteLoading(false)
    }
  }

  const handleNewComment = (comment) => {
    setPost((p) => ({ ...p, comments: [...p.comments, comment] }))
  }

  if (loading) return (
    <div className="page-wrapper">
      <div className="spinner-container"><div className="spinner" /></div>
    </div>
  )

  if (error || !post) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state">
          <div className="icon">😕</div>
          <h3>{error || 'Post not found'}</h3>
          <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Home</Link>
        </div>
      </div>
    </div>
  )

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const isAuthor = user?.id === post.author?.id || user?.username === post.author?.username
  const initials = post.author?.username?.[0]?.toUpperCase() || '?'

  return (
    <div className="page-wrapper">
      <article className="post-detail container" id="post-detail">

        {/* Cover image */}
        {post.cover_image_url && (
          <img
            className="post-detail-cover"
            src={post.cover_image_url}
            alt={post.title}
          />
        )}

        {/* Header */}
        <header className="post-detail-header">
          {post.category && (
            <span className="post-card-category">{post.category.name}</span>
          )}
          <h1 className="post-detail-title" id="post-title">{post.title}</h1>

          <div className="post-detail-meta">
            <span className="avatar">{initials}</span>
            <span><strong>{post.author?.username}</strong></span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>{date}</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>❤️ {post.total_likes} likes</span>
            <span>💬 {post.comments?.length} comments</span>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="tags" style={{ marginTop: '0.75rem' }}>
              {post.tags.split(',').map((t, i) => (
                <span key={i} className="tag">#{t.trim()}</span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="post-detail-body" id="post-content">
          {post.content}
        </div>

        {/* Actions bar */}
        <div className="post-detail-actions">
          <button
            id="like-btn"
            className={`like-btn ${post.is_liked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={likeLoading}
          >
            {post.is_liked ? '❤️' : '🤍'} {post.total_likes} Like{post.total_likes !== 1 ? 's' : ''}
          </button>

          {/* Author-only controls */}
          {isAuthor && (
            <>
              <Link
                id="edit-post-btn"
                to={`/edit/${post.id}`}
                className="btn btn-outline btn-sm"
              >
                ✏️ Edit
              </Link>
              <button
                id="delete-post-btn"
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : '🗑 Delete'}
              </button>
            </>
          )}

          <Link to="/" className="btn btn-sm" style={{ marginLeft: 'auto', color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
            ← Back
          </Link>
        </div>

        {/* Comments */}
        <CommentSection
          postId={post.id}
          comments={post.comments || []}
          onNewComment={handleNewComment}
        />
      </article>
    </div>
  )
}
