import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../utils/api'
import Navbar from '../components/Navbar'
import './Signup.css'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...signupData } = formData
      const response = await authAPI.signup(signupData)

      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))

      window.dispatchEvent(new Event('authChange'))
      navigate('/')
    } catch (err) {
      console.error('Signup error:', err)
      console.error('Error response:', err.response)
      
      let errorMessage = 'Signup failed. Please try again.'
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check your connection.'
      } else {
        // Error setting up request
        errorMessage = err.message || errorMessage
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-badge">Join the Revolution</div>
            <h2 className="sidebar-title">Fashion Reimagined, Planet Respected</h2>
            <p className="sidebar-tagline">Discover your next favorite piece. Sustainably sourced. Thoughtfully curated.</p>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            <h1 className="auth-title">ReThread</h1>
            <h2 className="auth-subtitle">Create your account</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Account Type</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="role-select"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password (min 6 characters)"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  minLength={6}
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
