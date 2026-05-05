import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

/**
 * CreatePost / EditPost Page — /create  and  /edit/:id
 *
 * Dual-mode form:
 *   editMode=false  → POST /api/posts/      (create new post)
 *   editMode=true   → PUT  /api/posts/:id/  (update existing post)
 *
 * Fields: title, content, category (dropdown), tags, cover_image (file)
 * Only authors and admins should reach this page (enforced via ProtectedRoute).
 */
export default function CreatePost({ editMode = false }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState({
    title: '', content: '', category_id: '', tags: ''
  })
  const [coverImage, setCoverImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(editMode)
  const [error, setError] = useState('')

  // Load categories for the dropdown
  useEffect(() => {
    api.get('/api/categories/').then((r) => setCategories(r.data))
  }, [])

  // If editing, pre-fill form with existing post values
  useEffect(() => {
    if (editMode && id) {
      api.get(`/api/posts/${id}/`)
        .then((r) => {
          const p = r.data
          setForm({
            title: p.title,
            content: p.content,
            category_id: p.category?.id || '',
            tags: p.tags || ''
          })
        })
        .catch(() => setError('Could not load post.'))
        .finally(() => setFetching(false))
    }
  }, [editMode, id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Use FormData to support optional file upload
      const data = new FormData()
      data.append('title', form.title)
      data.append('content', form.content)
      if (form.category_id) data.append('category_id', form.category_id)
      if (form.tags) data.append('tags', form.tags)
      if (coverImage) data.append('cover_image', coverImage)

      if (editMode) {
        await api.put(`/api/posts/${id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        navigate(`/post/${id}`)
      } else {
        const res = await api.post('/api/posts/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        navigate(`/post/${res.data.id}`)
      }
    } catch (err) {
      const data = err.response?.data
      setError(data ? JSON.stringify(data) : 'Failed to save post.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="page-wrapper">
      <div className="spinner-container"><div className="spinner" /></div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="card" id="create-post-card">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {editMode ? '✏️ Edit Post' : '✍️ Write a New Post'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {editMode ? 'Update your post below' : 'Share your ideas with the world'}
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} id="post-form">
            <div className="form-group">
              <label htmlFor="post-title">Title *</label>
              <input
                className="form-control"
                id="post-title"
                name="title"
                type="text"
                placeholder="An engaging title…"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="post-content">Content *</label>
              <textarea
                className="form-control"
                id="post-content"
                name="content"
                placeholder="Write your blog post here…"
                value={form.content}
                onChange={handleChange}
                rows={12}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="post-category">Category</label>
                <select
                  className="form-control"
                  id="post-category"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                >
                  <option value="">— No category —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="post-tags">Tags</label>
                <input
                  className="form-control"
                  id="post-tags"
                  name="tags"
                  type="text"
                  placeholder="e.g. #technology, #lifestyle, #coding"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Cover Image (optional)</label>
              <div className="file-upload-area" onClick={() => document.getElementById('post-cover').click()}>
                <input
                  id="post-cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  style={{ display: 'none' }}
                />
                {coverImage ? (
                  <div className="file-upload-preview">
                    <span className="file-upload-icon">🖼️</span>
                    <span className="file-upload-name">{coverImage.name}</span>
                    <button
                      type="button"
                      className="file-upload-remove"
                      onClick={(e) => { e.stopPropagation(); setCoverImage(null); document.getElementById('post-cover').value = '' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="file-upload-placeholder">
                    <span className="file-upload-icon">📁</span>
                    <span>Click to choose a cover image</span>
                    <span className="file-upload-hint">JPG, PNG, or WebP — max 5 MB</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                id="post-submit"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving…' : editMode ? 'Update Post' : 'Publish Post'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
