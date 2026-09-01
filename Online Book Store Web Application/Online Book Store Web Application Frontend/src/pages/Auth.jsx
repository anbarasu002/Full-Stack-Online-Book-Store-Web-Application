import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import './Auth.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_STRENGTH_PATTERN = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/

export default function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register, logout } = useAuth()
  const { refreshCart } = useCart()
  const { refreshWishlist } = useWishlist()

  const [isRegisterActive, setIsRegisterActive] = useState(location.pathname === '/register')

  const redirectTo = location.state?.from?.pathname || '/'

  async function afterAuthSuccess() {
    await Promise.all([refreshCart(), refreshWishlist()])
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className={`container ${isRegisterActive ? 'active' : ''}`}>
        <LoginForm active={!isRegisterActive} onSuccess={afterAuthSuccess} login={login} />
        <RegisterForm
          active={isRegisterActive}
          onRegistered={() => setIsRegisterActive(false)}
          register={register}
          logout={logout}
        />

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don&apos;t have an account?</p>
            <button type="button" className="btn register-btn" onClick={() => setIsRegisterActive(true)}>
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button type="button" className="btn login-btn" onClick={() => setIsRegisterActive(false)}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginForm({ active, onSuccess, login }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const redirectTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current)
    }
  }, [])

  function validate() {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!EMAIL_PATTERN.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      await login(form.email.trim(), form.password)
      setSuccess(true)
      redirectTimer.current = setTimeout(() => {
        onSuccess()
      }, 1600)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="form-box login" aria-hidden={!active}>
        <div className="success-panel">
          <i className="bx bxs-check-circle"></i>
          <h1>Login Successful!</h1>
          <p>Taking you to the homepage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-box login" aria-hidden={!active}>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Login</h1>

        {serverError && <div className="server-error">{serverError}</div>}

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            className={errors.email ? 'has-error' : ''}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            tabIndex={active ? 0 : -1}
          />
          <i className="bx bxs-envelope"></i>
        </div>
        {errors.email && <div className="field-error">{errors.email}</div>}

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            className={errors.password ? 'has-error' : ''}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            tabIndex={active ? 0 : -1}
          />
          <i className="bx bxs-lock-alt"></i>
        </div>
        {errors.password && <div className="field-error">{errors.password}</div>}

        <button type="submit" className="btn" disabled={submitting} tabIndex={active ? 0 : -1}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

function RegisterForm({ active, onRegistered, register, logout }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const redirectTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current)
    }
  }, [])

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'

    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!EMAIL_PATTERN.test(form.email)) errs.email = 'Enter a valid email address'

    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    else if (!PASSWORD_STRENGTH_PATTERN.test(form.password))
      errs.password = 'Include an uppercase letter, lowercase letter and a number'

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match'

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)

      await logout()
      setSuccess(true)
      redirectTimer.current = setTimeout(() => {
        onRegistered()
        setSuccess(false)
        setForm({ name: '', email: '', password: '', confirmPassword: '' })
      }, 1600)
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }))
      } else {
        setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="form-box register" aria-hidden={!active}>
        <div className="success-panel">
          <i className="bx bxs-check-circle"></i>
          <h1>Registration Successful!</h1>
          <p>Your account has been created. Redirecting you to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-box register" aria-hidden={!active}>
      <form onSubmit={handleSubmit} noValidate>
        <h1>Registration</h1>

        {serverError && <div className="server-error">{serverError}</div>}

        <div className="input-box">
          <input
            type="text"
            placeholder="Full name"
            className={errors.name ? 'has-error' : ''}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
            tabIndex={active ? 0 : -1}
          />
          <i className="bx bxs-user"></i>
        </div>
        {errors.name && <div className="field-error">{errors.name}</div>}

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            className={errors.email ? 'has-error' : ''}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            tabIndex={active ? 0 : -1}
          />
          <i className="bx bxs-envelope"></i>
        </div>
        {errors.email && <div className="field-error">{errors.email}</div>}

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            className={errors.password ? 'has-error' : ''}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
            tabIndex={active ? 0 : -1}
          />
          <i className="bx bxs-lock-alt"></i>
        </div>
        {errors.password && <div className="field-error">{errors.password}</div>}

        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm password"
            className={errors.confirmPassword ? 'has-error' : ''}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            autoComplete="new-password"
            tabIndex={active ? 0 : -1}
          />
          <i className="bx bxs-check-shield"></i>
        </div>
        {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}

        <button type="submit" className="btn" disabled={submitting} tabIndex={active ? 0 : -1}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
