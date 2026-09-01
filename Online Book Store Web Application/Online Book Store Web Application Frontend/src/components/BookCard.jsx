import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import StarRating from './StarRating'
import './BookCard.css'

export default function BookCard({ book }) {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist()
  const wished = isWishlisted(book.id)

  async function handleAddToCart(e) {
    e.preventDefault()
    if (!isAuthenticated) return
    await addToCart(book.id, 1)
  }

  async function handleToggleWishlist(e) {
    e.preventDefault()
    if (!isAuthenticated) return
    if (wished) {
      await removeFromWishlist(book.id)
    } else {
      await addToWishlist(book.id)
    }
  }

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-card-cover">
        <img src={book.coverImage} alt={`Cover of ${book.title}`} loading="lazy" />
        <button
          className={`wishlist-toggle ${wished ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isAuthenticated ? undefined : 'Log in to save books'}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-6.7-4.3-9.3-8.4C.8 9.5 1.7 5.9 4.8 4.6c2.3-.9 4.6.1 5.9 2 .3.4.9.4 1.2 0 1.3-1.9 3.6-2.9 5.9-2 3.1 1.3 4 4.9 2.1 8-2.6 4.1-9.3 8.4-9.3 8.4z" />
          </svg>
        </button>
        {book.stock === 0 && <span className="out-of-stock-tag">Out of stock</span>}
      </div>
      <div className="book-card-body">
        <span className="badge badge-forest">{book.category}</span>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <StarRating rating={book.rating} />
        <div className="book-card-footer">
          <span className="book-card-price">₹{book.price.toFixed(2)}</span>
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart} disabled={book.stock === 0}>
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}
