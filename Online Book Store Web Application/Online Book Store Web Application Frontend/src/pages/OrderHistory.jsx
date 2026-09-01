import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { orderApi } from '../api/orderApi'
import LoadingSpinner from '../components/LoadingSpinner'
import './OrderHistory.css'

const STATUS_STYLES = {
  PLACED: 'badge-gold',
  PROCESSING: 'badge-gold',
  SHIPPED: 'badge-forest',
  DELIVERED: 'badge-forest',
  CANCELLED: 'badge-burgundy',
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()
  const justPlacedOrderId = location.state?.justPlacedOrderId

  useEffect(() => {
    orderApi.getMyOrders()
      .then((res) => setOrders(res.data.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))))
      .catch(() => setError('Could not load your orders right now.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 24 }}><span className="spine-mark" />Order History</h1>

        {justPlacedOrderId && (
          <div className="alert alert-success">Order #{justPlacedOrderId} was placed successfully. Thank you!</div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Once you place an order, it will show up here.</p>
            <Link to="/books" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Books</Link>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p className="order-date">{new Date(order.placedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className={`badge ${STATUS_STYLES[order.status] || 'badge-ink'}`}>{order.status}</span>
                </div>

                <div className="order-card-items">
                  {order.items.map((item) => (
                    <div key={item.bookId} className="order-item-row">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          style={{
                            width: 34,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: 4,
                            flexShrink: 0
                          }}
                        />
                        {item.title} × {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span>Shipping to: {order.shippingAddress}</span>
                  <strong>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}