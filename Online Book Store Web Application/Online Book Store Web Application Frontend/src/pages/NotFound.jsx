import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty-state">
        <h1 style={{ fontSize: '3rem' }}>404</h1>
        <h3>This page has been checked out</h3>
        <p>We couldn&apos;t find the page you were looking for.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Home</Link>
      </div>
    </div>
  )
}
