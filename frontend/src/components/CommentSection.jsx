import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

/**
 * CommentSection — displays and adds comments for a post
 * Props:
 *   postId    — ID of the post
 *   comments  — array of comment objects from the API
 *   onNewComment(comment) — called with new comment data after successful submit
 */
export default function CommentSection({ postId, comments, onNewComment }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await api.post(`/api/posts/${postId}/comment/`, { content: text })
      onNewComment(res.data)
      setText('')
    } catch {
      setError('Failed to post comment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comments-section" id="comments-section">
      <h3>💬 {comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No comments yet — be the first to share your thoughts!
        </p>
      ) : (
        comments.map((c) => {
          const initials = c.user?.username?.[0]?.toUpperCase() || '?'
          const date = new Date(c.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
          })
          return (
            <div key={c.id} className="comment-item">
              <span className="avatar">{initials}</span>
              <div className="comment-content">
                <strong>{c.user?.username}</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
                  {date}
                </span>
                <p>{c.content}</p>
              </div>
            </div>
          )
        })
      )}

      {/* Add comment form — only for logged-in users */}
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit} id="comment-form">
          <input
            id="comment-input"
            type="text"
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            id="comment-submit"
            disabled={loading || !text.trim()}
          >
            {loading ? '…' : 'Post'}
          </button>
        </form>
      ) : (
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <a href="/login">Log in</a> to leave a comment.
        </p>
      )}

      {error && <div className="alert alert-error" style={{ marginTop: '0.75rem' }}>{error}</div>}
    </div>
  )
}
