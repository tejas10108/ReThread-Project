import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import './Wishlist.css'

function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      const response = await api.get('/wishlist')
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      fetchWishlist()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>Items you've saved for later</p>
        </div>

        {loading ? (
          <div className="loading">Loading wishlist...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>Your wishlist is empty</p>
            <Link to="/listings" className="browse-link">Browse Listings →</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map(item => (
              <div key={item.id} className="wishlist-item">
                <Link to={`/item/${item.id}`} className="item-link">
                  <div className="item-image">
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt={item.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h3>{item.title}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-condition">{item.condition}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                </Link>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Wishlist

