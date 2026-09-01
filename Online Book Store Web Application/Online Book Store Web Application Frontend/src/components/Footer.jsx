import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footerTop">
        <div className="container">

          <h3>SHOP BY CATEGORY</h3>

          <div className="categoryGrid">

            <ul>
              <li><Link to="/books?category=fiction">Fiction</Link></li>
              <li><Link to="/books?category=romance">Romance</Link></li>
              <li><Link to="/books?category=mystery">Mystery</Link></li>
              <li><Link to="/books?category=thriller">Thriller</Link></li>
              <li><Link to="/books?category=fantasy">Fantasy</Link></li>
            </ul>

            <ul>
              <li><Link to="/books?category=biography">Biography</Link></li>
              <li><Link to="/books?category=history">History</Link></li>
              <li><Link to="/books?category=self-help">Self Help</Link></li>
              <li><Link to="/books?category=business">Business</Link></li>
              <li><Link to="/books?category=education">Education</Link></li>
            </ul>

            <ul>
              <li><Link to="/books?category=children">Children</Link></li>
              <li><Link to="/books?category=young-adult">Young Adult</Link></li>
              <li><Link to="/books?category=poetry">Poetry</Link></li>
              <li><Link to="/books?category=science">Science</Link></li>
              <li><Link to="/books?category=technology">Technology</Link></li>
            </ul>

            <ul>
              <li><Link to="/books?category=classic">Classics</Link></li>
              <li><Link to="/books?category=philosophy">Philosophy</Link></li>
              <li><Link to="/books?category=health">Health</Link></li>
              <li><Link to="/books?category=cooking">Cooking</Link></li>
              <li><Link to="/books?category=travel">Travel</Link></li>
            </ul>

          </div>
        </div>
      </div>

      <div className="footerBottom">

        <div className="container footerBottomGrid">

          <div className="footer-section">

            <div className="footer-logo">
              <span className="spine-mark" aria-hidden="true" />
              BOOK WORLD
            </div>

            <p className="footer-tagline">
              A shelf for every reader.
            </p>

            <h4>FOLLOW US</h4>

            <div className="socialIcons">
              <span>f</span>
              <span>𝕏</span>
              <span>in</span>
              <span>◎</span>
            </div>

          </div>

          <div className="footer-section">

            <h4>BOOK WORLD</h4>

            <Link to="/">Home</Link>
            <Link to="/books">Browse Books</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>

          </div>

          <div className="footer-section">

            <h4>QUICK LINKS</h4>

            <Link to="/profile">My Profile</Link>
            <Link to="/books">All Books</Link>
            <Link to="/wishlist">My Wishlist</Link>
            <Link to="/cart">Shopping Cart</Link>

          </div>

          <div className="footer-section">

            <h4>CONTACT US</h4>

            <p>📧 support@bookworld.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 Chennai, India</p>

          </div>

        </div>

      </div>

      <div className="footerCopy">

        <p>
          © {new Date().getFullYear()} BookWorld Bookstore.
          All Rights Reserved.
        </p>

      </div>

    </footer>
  )
}
