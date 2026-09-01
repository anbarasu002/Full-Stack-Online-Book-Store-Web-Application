import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../api/profileApi'

export default function Profile() {
  const { user, updateUserInPlace } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    address: user?.address || '',
    phone: user?.phone || '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      const res = await profileApi.updateProfile(form)
      updateUserInPlace(res.data)
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="section-title" style={{ marginBottom: 24 }}><span className="spine-mark" />Your Profile</h1>

        <div className="card" style={{ padding: 28 }}>
          {status === 'success' && <div className="alert alert-success">Profile updated successfully.</div>}
          {status === 'error' && <div className="alert alert-error">Could not update your profile. Please try again.</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user?.email || ''} disabled />
              <div className="form-hint">Email cannot be changed.</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input
                id="name"
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                className="form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Default shipping address</label>
              <textarea
                id="address"
                className="form-textarea"
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
