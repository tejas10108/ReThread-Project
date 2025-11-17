import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../utils/api'
import Navbar from '../components/Navbar'
import './Login.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))

      window.dispatchEvent(new Event('authChange'))
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      console.error('Error response:', err.response)
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (err.response) {
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage
      } else if (err.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.'
      } else {
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
            <div className="sidebar-badge">Sustainable Fashion</div>
            <h2 className="sidebar-title">Where Style Meets Sustainability</h2>
            <p className="sidebar-tagline">Curated second-hand finds. Endless possibilities.</p>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            <h1 className="auth-title">ReThread</h1>
            <h2 className="auth-subtitle">Login to your account</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className={`auth-button ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
