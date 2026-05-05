import { useNavigate } from 'react-router-dom'

/**
 * PostCard — displays a blog post summary in the posts grid
 * Props:
 *   post  — post object from the API { id, title, content, author, category,
 *            tags, cover_image, created_at, total_likes, is_liked }
 */
export default function PostCard({ post }) {
  const navigate = useNavigate()

  const excerpt = post.content.length > 120
    ? post.content.substring(0, 120) + '…'
    : post.content

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  const initials = post.author?.username?.[0]?.toUpperCase() || '?'

  return (
    <div
      className="post-card"
      onClick={() => navigate(`/post/${post.id}`)}
      id={`post-card-${post.id}`}
      role="article"
    >
      {/* Cover image or gradient placeholder */}
      {post.cover_image_url ? (
        <img
          className="post-card-image"
          src={post.cover_image_url}
          alt={post.title}
        />
      ) : (
        <div className="post-card-image-placeholder">
          ✍️
        </div>
      )}

      <div className="post-card-body">
        {/* Category */}
        {post.category && (
          <span className="post-card-category">
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <h2 className="post-card-title">{post.title}</h2>

        {/* Excerpt */}
        <p className="post-card-excerpt">{excerpt}</p>

        {/* Tags */}
        {post.tags && (
          <div className="tags" style={{ marginBottom: '0.75rem' }}>
            {post.tags.split(',').map((t, i) => (
              <span key={i} className="tag">#{t.trim()}</span>
            ))}
          </div>
        )}

        {/* Meta: author, date, stats */}
        <div className="post-card-meta">
          <div className="post-card-meta-left">
            <span className="avatar">{initials}</span>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.82rem' }}>
                {post.author?.username}
              </div>
              <div style={{ fontSize: '0.75rem' }}>{date}</div>
            </div>
          </div>
          <div className="post-card-actions">
            <span title="Likes">❤️ {post.total_likes}</span>
            <span title="Comments">💬 {post.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
