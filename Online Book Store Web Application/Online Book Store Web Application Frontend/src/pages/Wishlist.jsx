import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Wishlist() {
  const { items, loading, refreshWishlist } = useWishlist()

  useEffect(() => { refreshWishlist() }, [refreshWishlist])

  if (loading) return <LoadingSpinner />

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 24 }}><span className="spine-mark" />Your Wishlist</h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <h3>Your wishlist is empty</h3>
            <p>Tap the heart on any book to save it here.</p>
            <Link to="/books" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Books</Link>
          </div>
        ) : (
          <div className="book-grid">
            {items.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  )
}
