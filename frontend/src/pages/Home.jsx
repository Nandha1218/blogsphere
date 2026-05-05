import { useState, useEffect } from 'react'
import api from '../api/axios'
import PostCard from '../components/PostCard'

/**
 * Home Page — /
 *
 * Displays the hero section, category filter chips, search bar,
 * and a responsive grid of all blog posts.
 *
 * Features:
 *  - Search by keyword (hits backend ?search= param)
 *  - Filter by category (hits backend ?category= param)
 *  - Live loading state + empty state handling
 */
export default function Home() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Load categories once on mount
  useEffect(() => {
    api.get('/api/categories/')
      .then((r) => setCategories(r.data))
      .catch(() => {})
  }, [])

  // Re-fetch posts whenever search or category filter changes
  useEffect(() => {
    fetchPosts()
  }, [search, activeCategory])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (activeCategory) params.append('category', activeCategory)

      const res = await api.get(`/api/posts/?${params.toString()}`)
      setPosts(res.data)
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const handleCategoryClick = (slug) => {
    setActiveCategory(activeCategory === slug ? '' : slug)
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero" id="home-hero">
        <div className="container">
          <h1>Stories Worth Reading</h1>
          <p>Discover articles written by real people about what matters most.</p>

          {/* Search bar */}
          <form className="search-bar" onSubmit={handleSearch} id="search-form">
            <input
              id="search-input"
              type="text"
              placeholder="Search posts, authors, tags…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" id="search-btn">Search</button>
          </form>

          {/* Category filter chips */}
          {categories.length > 0 && (
            <div className="category-chips">
              <button
                className={`chip ${!activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory('')}
                id="chip-all"
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`chip-${cat.slug}`}
                  className={`chip ${activeCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Posts Grid ───────────────────────────────── */}
      <main className="page-wrapper" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {/* Active search / filter indicator */}
          {(search || activeCategory) && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {search && <span>Results for <strong style={{ color: 'var(--text-primary)' }}>"{search}"</strong> </span>}
              {activeCategory && <span>in <strong style={{ color: 'var(--accent)' }}>{activeCategory}</strong></span>}
              <button
                onClick={() => { setSearch(''); setSearchInput(''); setActiveCategory('') }}
                style={{ marginLeft: '0.75rem', color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕ Clear
              </button>
            </div>
          )}

          {loading ? (
            <div className="spinner-container"><div className="spinner" /></div>
          ) : posts.length === 0 ? (
            <div className="empty-state" id="empty-state">
              <div className="icon">📭</div>
              <h3>No posts found</h3>
              <p>Try a different search or check back later.</p>
            </div>
          ) : (
            <div className="posts-grid" id="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
