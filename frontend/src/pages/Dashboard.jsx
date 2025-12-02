import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import './Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ totalItems: 0, wishlistCount: 0 })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const fetchStats = async () => {
      try {
        const [itemsRes, wishlistRes] = await Promise.all([
          api.get('/items?limit=1'),
          api.get('/wishlist')
        ])
        setStats({
          totalItems: itemsRes.data.pagination?.total || 0,
          wishlistCount: wishlistRes.data?.length || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
          <p>Your thrift shopping hub</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.totalItems}</h3>
            <p>Total Items</p>
            <Link to="/listings" className="stat-link">Browse All →</Link>
          </div>
          <div className="stat-card">
            <h3>{stats.wishlistCount}</h3>
            <p>Wishlist Items</p>
            <Link to="/wishlist" className="stat-link">View Wishlist →</Link>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/listings" className="action-btn primary">
            Browse Listings
          </Link>
          <Link to="/wishlist" className="action-btn secondary">
            My Wishlist
          </Link>
          <Link to="/profile" className="action-btn secondary">
            My Profile
          </Link>
        </div>
      </div>
    </>
  )
}

export default Dashboard

