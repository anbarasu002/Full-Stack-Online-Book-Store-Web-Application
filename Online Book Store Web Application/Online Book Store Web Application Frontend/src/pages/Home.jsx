import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookApi } from '../api/bookApi'
import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'
import './Home.css'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      bookApi.getBooks({ sortBy: 'rating_desc' }),
      bookApi.getCategories(),
    ])
      .then(([booksRes, catsRes]) => {
        if (!active) return
        setFeatured(booksRes.data.slice(0, 8))
        setCategories(catsRes.data)
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <p className="hero-eyebrow">Est. today, for readers of every kind</p>
          <h1 className="hero-title">Find your next favorite book<br />before you finish this one.</h1>
          <p className="hero-sub">
            Browse a growing shelf of fiction, technology, fantasy and more — curated,
            searchable, and ready for your cart.
          </p>
          <div className="hero-actions">
            <Link to="/books" className="btn btn-gold">Browse the Catalog</Link>
            <Link to="/books?sortBy=rating_desc" className="btn btn-secondary hero-btn-outline">Top Rated</Link>
          </div>
        </div>
      </section>

      <div className="container page">
        {categories.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 className="section-title"><span className="spine-mark" />Shop by Category</h2>
            <div className="category-row">
              {categories.map((cat) => (
                <Link key={cat} to={`/books?category=${encodeURIComponent(cat)}`} className="category-chip">
                  {cat}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="section-title"><span className="spine-mark" />Highly Rated Right Now</h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="book-grid" style={{ marginTop: 20 }}>
              {featured.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
