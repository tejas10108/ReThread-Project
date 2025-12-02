import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './Navbar.css'

function Navbar() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
        setCartCount(0)
      }
    }

    const fetchCartCount = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        try {
          const response = await api.get('/cart')
          setCartCount(response.data.count || 0)
        } catch (error) {
          setCartCount(0)
        }
      }
    }

    checkAuth()
    if (localStorage.getItem('accessToken')) {
      fetchCartCount()
    }

    window.addEventListener('authChange', checkAuth)
    const interval = setInterval(fetchCartCount, 5000) // Refresh cart count every 5 seconds

    return () => {
      window.removeEventListener('authChange', checkAuth)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  const getFirstName = (name) => {
    return name ? name.split(' ')[0] : 'User'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/listings" className="navbar-logo">
          <div className="logo-container">
            <span className="logo-text">Re</span>
            <span className="logo-accent">Thread</span>
          </div>
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/listings" className="nav-link">Listings</Link>
              <Link to="/wishlist" className="nav-link">Wishlist</Link>
              <Link to="/cart" className="nav-link">
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <span className="nav-greeting">Hi, {getFirstName(user.name)}</span>
              <button onClick={handleLogout} className="nav-link nav-link-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link nav-link-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
