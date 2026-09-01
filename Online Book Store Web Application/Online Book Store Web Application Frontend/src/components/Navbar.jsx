import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  function handleSearch(e) {
    e.preventDefault()

    navigate(
      query.trim()
        ? `/books?query=${encodeURIComponent(query.trim())}`
        : '/books'
    )

    setMenuOpen(false)
    setUserDropdownOpen(false)
  }

  async function handleLogout() {
    await logout()

    setMenuOpen(false)
    setUserDropdownOpen(false)

    navigate('/')
  }

  function handleUserClick() {
    setUserDropdownOpen((prev) => !prev)
  }

  function closeMenus() {
    setMenuOpen(false)
    setUserDropdownOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenus}
        >
          <span className="spine-mark" aria-hidden="true" />
          <span className="navbar-logo-text">
            BOOK WORLD
          </span>
        </Link>

        <form
          className="navbar-search"
          onSubmit={handleSearch}
          role="search"
        >
          <input
            type="search"
            placeholder="Search by title, author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search books"
          />

          <button type="submit" aria-label="Search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>
          </button>
        </form>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          type="button"
        >
          ☰
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>

          <Link
            to="/"
            onClick={closeMenus}
          >
            Home
          </Link>

          <Link
            to="/books"
            onClick={closeMenus}
          >
            Books
          </Link>

          <Link
            to="/wishlist"
            onClick={closeMenus}
          >
            Wishlist
          </Link>

          <Link
            to="/cart"
            className="navbar-cart"
            onClick={closeMenus}
          >
            Cart
            {itemCount > 0 && (
              <span className="cart-badge">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="navbar-user">

              <button
                type="button"
                className="navbar-greeting"
                onClick={handleUserClick}
                aria-expanded={userDropdownOpen}
              >
                Hi, {user?.name?.split(' ')[0] || 'User'}
              </button>

              {userDropdownOpen && (
                <div className="navbar-dropdown">

                  <Link
                    to="/profile"
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={closeMenus}
                  >
                    Order History
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenus}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="navbar-logout"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          ) : (

            <div className="navbar-auth">

              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                onClick={closeMenus}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                onClick={closeMenus}
              >
                Sign Up
              </Link>

            </div>
          )}

        </nav>
      </div>
    </header>
  )
}
