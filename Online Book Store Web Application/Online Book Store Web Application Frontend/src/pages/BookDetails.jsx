import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { bookApi } from '../api/bookApi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import StarRating from '../components/StarRating'
import LoadingSpinner from '../components/LoadingSpinner'
import './BookDetails.css'

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist()

  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addStatus, setAddStatus] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    bookApi.getBookById(id)
      .then((res) => setBook(res.data))
      .catch(() => setError('This book could not be found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/books/${id}` } } })
      return
    }
    await addToCart(book.id, quantity)
    setAddStatus('Added to cart!')
    setTimeout(() => setAddStatus(''), 2000)
  }

  async function handleToggleWishlist() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/books/${id}` } } })
      return
    }
    if (isWishlisted(book.id)) await removeFromWishlist(book.id)
    else await addToWishlist(book.id)
  }

  if (loading) return <LoadingSpinner />
  if (error) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h3>{error}</h3>
          <Link to="/books" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Books</Link>
        </div>
      </div>
    )
  }

  const wished = isWishlisted(book.id)

  return (
    <div className="page">
      <div className="container details-layout">
        <div className="details-cover">
          <img src={book.coverImage} alt={`Cover of ${book.title}`} />
        </div>

        <div className="details-info">
          <span className="badge badge-forest">{book.category}</span>
          <h1 style={{ marginTop: 10 }}>{book.title}</h1>
          <p className="details-author">by {book.author}</p>
          <StarRating rating={book.rating} size={16} />

          <p className="details-price">₹{book.price.toFixed(2)}</p>

          <p className={`details-stock ${book.stock === 0 ? 'out' : ''}`}>
            {book.stock === 0 ? 'Out of stock' : `${book.stock} in stock`}
          </p>

          <p className="details-description">{book.description}</p>

          {book.tags?.length > 0 && (
            <div className="details-tags">
              {book.tags.map((t) => <span key={t} className="badge badge-ink">{t}</span>)}
            </div>
          )}

          {addStatus && <div className="alert alert-success">{addStatus}</div>}

          <div className="details-actions">
            <div className="quantity-picker">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(book.stock || 1, q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={book.stock === 0}>
              Add to Cart
            </button>
            <button className={`btn ${wished ? 'btn-danger' : 'btn-secondary'}`} onClick={handleToggleWishlist}>
              {wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {book.isbn && <p className="details-isbn">ISBN: {book.isbn}</p>}
        </div>
      </div>
    </div>
  )
}
