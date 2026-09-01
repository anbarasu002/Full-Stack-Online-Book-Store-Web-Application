import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bookApi } from '../api/bookApi'
import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'
import './BookListing.css'

export default function BookListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const query = searchParams.get('query') || ''
  const category = searchParams.get('category') || 'all'
  const sortBy = searchParams.get('sortBy') || ''
  const minRating = searchParams.get('minRating') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const fetchBooks = useCallback(() => {
    setLoading(true)
    setError('')
    bookApi.getBooks({
      query: query || undefined,
      category: category !== 'all' ? category : undefined,
      sortBy: sortBy || undefined,
      minRating: minRating || undefined,
      maxPrice: maxPrice || undefined,
    })
      .then((res) => setBooks(res.data))
      .catch(() => setError('Could not load books right now. Please try again.'))
      .finally(() => setLoading(false))
  }, [query, category, sortBy, minRating, maxPrice])

  useEffect(() => {
    bookApi.getCategories().then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 24 }}>
          <span className="spine-mark" />
          {query ? `Results for "${query}"` : 'All Books'}
        </h1>

        <div className="listing-layout">
          <aside className="filters-panel">
            <div className="filter-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => updateParam('category', e.target.value === 'all' ? '' : e.target.value)}>
                <option value="all">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Sort by</label>
              <select className="form-select" value={sortBy} onChange={(e) => updateParam('sortBy', e.target.value)}>
                <option value="">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="title_asc">Title: A-Z</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Max price</label>
              <input
                type="number"
                min="0"
                className="form-input"
                placeholder="Any price"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Minimum rating</label>
              <select className="form-select" value={minRating} onChange={(e) => updateParam('minRating', e.target.value)}>
                <option value="">Any rating</option>
                <option value="4.5">4.5 &amp; up</option>
                <option value="4">4.0 &amp; up</option>
                <option value="3.5">3.5 &amp; up</option>
              </select>
            </div>

            {(category !== 'all' || sortBy || minRating || maxPrice || query) && (
              <button className="btn btn-secondary btn-sm btn-block" onClick={() => setSearchParams({})}>
                Clear filters
              </button>
            )}
          </aside>

          <div className="listing-results">
            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
              <LoadingSpinner />
            ) : books.length === 0 ? (
              <div className="empty-state">
                <h3>No books match your search</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.88rem', marginBottom: 16 }}>
                  {books.length} book{books.length !== 1 ? 's' : ''} found
                </p>
                <div className="book-grid">
                  {books.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
