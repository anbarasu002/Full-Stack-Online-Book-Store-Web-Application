import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../api/orderApi'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Checkout() {
  const { items, totalAmount, loading, refreshCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  const [country, setCountry] = useState('India')
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  async function handlePlaceOrder(e) {
    e.preventDefault()

    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!phone.trim()) {
      setError('Please enter your phone number')
      return
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    if (!address.trim()) {
      setError('Please enter your shipping address')
      return
    }

    if (!country.trim()) {
      setError('Please select your country')
      return
    }

    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }

    setError('')
    setPlacing(true)

    try {
      const orderData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        shippingAddress: address.trim(),
        country: country.trim(),
        paymentMethod
      }

      const res = await orderApi.placeOrder(orderData)

      await clearCart()

      navigate('/orders', {
        state: {
          justPlacedOrderId: res.data.id
        }
      })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not place your order. Please try again.'
      )
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h3>Your cart is empty</h3>

          <p>
            Add some books before checking out.
          </p>

          <Link
            to="/books"
            className="btn btn-primary"
            style={{ marginTop: 16 }}
          >
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">

      <div
        className="container"
        style={{ maxWidth: 700 }}
      >

        <h1
          className="section-title"
          style={{ marginBottom: 24 }}
        >
          <span className="spine-mark" />
          Checkout
        </h1>

        <div
          className="card"
          style={{ padding: 24, marginBottom: 20 }}
        >
          <h3 style={{ marginBottom: 16 }}>
            Order Summary
          </h3>

          {items.map(({ book, quantity, subtotal }) => (
            <div
              key={book.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.9rem',
                marginBottom: 8
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{
                    width: 38,
                    height: 54,
                    objectFit: 'cover',
                    borderRadius: 4,
                    flexShrink: 0
                  }}
                />
                {book.title} × {quantity}
              </span>

              <span>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              borderTop: '1px solid var(--color-border)',
              paddingTop: 12,
              marginTop: 8
            }}
          >
            <span>Total</span>

            <span>
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {error && (
          <div
            className="alert alert-error"
            style={{ marginBottom: 20 }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>

          <div
            className="card"
            style={{ padding: 24 }}
          >

            <h3 style={{ marginBottom: 20 }}>
              Customer Details
            </h3>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="name"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="email"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="phone"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/\D/g, '').slice(0, 10)
                  )
                }
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="address"
              >
                Shipping Address
              </label>

              <textarea
                id="address"
                className="form-textarea"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Street, City, State, ZIP Code"
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="country"
              >
                Country
              </label>

              <select
                id="country"
                className="form-input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
              </select>
            </div>

            <div className="form-group">

              <label className="form-label">
                Payment Method
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 10,
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span>
                  Cash on Delivery
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <span>
                  UPI / Net Banking
                </span>
              </label>

            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={placing}
              style={{ marginTop: 10 }}
            >
              {placing
                ? 'Placing order...'
                : `Place Order — ₹${totalAmount.toFixed(2)}`
              }
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}