import { useEffect, useState } from 'react'
import { bookApi } from '../api/bookApi'
import { adminApi } from '../api/adminApi'
import LoadingSpinner from '../components/LoadingSpinner'
import './AdminDashboard.css'

const EMPTY_BOOK_FORM = {
  title: '', author: '', description: '', category: '', price: '', stock: '', coverImage: '', isbn: '', tags: '',
}

const ORDER_STATUSES = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminDashboard() {
  const [tab, setTab] = useState('books')

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 20 }}><span className="spine-mark" />Admin Dashboard</h1>

        <div className="admin-tabs">
          <button className={tab === 'books' ? 'active' : ''} onClick={() => setTab('books')}>Manage Books</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Manage Orders</button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Users</button>
        </div>

        {tab === 'books' && <BooksPanel />}
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'users' && <UsersPanel />}
      </div>
    </div>
  )
}

function BooksPanel() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_BOOK_FORM)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function loadBooks() {
    setLoading(true)
    bookApi.getBooks({}).then((res) => setBooks(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { loadBooks() }, [])

  function startEdit(book) {
    setEditingId(book.id)
    setForm({
      title: book.title, author: book.author, description: book.description || '',
      category: book.category, price: book.price, stock: book.stock,
      coverImage: book.coverImage || '', isbn: book.isbn || '', tags: (book.tags || []).join(', '),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_BOOK_FORM)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.author.trim() || !form.category.trim() || !form.price) {
      setError('Title, author, category and price are required.')
      return
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      coverImage: form.coverImage.trim() || 'https://picsum.photos/seed/newbook/400/600',
      isbn: form.isbn.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }

    setSaving(true)
    try {
      if (editingId) await adminApi.updateBook(editingId, payload)
      else await adminApi.createBook(payload)
      resetForm()
      loadBooks()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this book.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this book? This cannot be undone.')) return
    await adminApi.deleteBook(id)
    loadBooks()
  }

  return (
    <div className="admin-grid">
      <div className="card admin-form-card">
        <h3>{editingId ? 'Edit Book' : 'Add New Book'}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Author</label>
            <input className="form-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input type="number" step="0.01" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input type="number" className="form-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cover image URL</label>
            <input className="form-input" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">ISBN</label>
            <input className="form-input" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Book' : 'Add Book'}
            </button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-list-card">
        {loading ? <LoadingSpinner /> : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.category}</td>
                  <td>₹{b.price.toFixed(2)}</td>
                  <td>{b.stock}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(b)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function OrdersPanel() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  function loadOrders() {
    setLoading(true)
    adminApi.getAllOrders().then((res) => setOrders(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [])

  async function handleStatusChange(orderId, status) {
    await adminApi.updateOrderStatus(orderId, status)
    loadOrders()
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="admin-list-card">
      <table className="admin-table">
        <thead>
          <tr><th>Order</th><th>User ID</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.userId}</td>
              <td>₹{o.totalAmount.toFixed(2)}</td>
              <td>
                <select className="form-select" value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p style={{ padding: 20, color: 'var(--color-ink-soft)' }}>No orders placed yet.</p>}
    </div>
  )
}

function UsersPanel() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getAllUsers().then((res) => setUsers(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="admin-list-card">
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-gold' : 'badge-forest'}`}>{u.role}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
