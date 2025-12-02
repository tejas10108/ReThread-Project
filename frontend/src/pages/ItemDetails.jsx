import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import './ItemDetails.css'

function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`)
        setItem(response.data)
      } catch (error) {
        console.error('Error fetching item:', error)
      } finally {
        setLoading(false)
      }
    }

    const checkWishlist = async () => {
      try {
        const response = await api.get('/wishlist')
        const wishlistItems = response.data
        setInWishlist(wishlistItems.some(w => w.id === parseInt(id)))
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }

    fetchItem()
    checkWishlist()
  }, [id])

  const handleToggleWishlist = async () => {
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${id}`)
        setInWishlist(false)
      } else {
        await api.post('/wishlist', { productId: parseInt(id) })
        setInWishlist(true)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="item-details-container">
          <div className="loading">Loading item details...</div>
        </div>
      </>
    )
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="item-details-container">
          <div className="error">Item not found</div>
          <Link to="/listings" className="back-link">← Back to Listings</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="item-details-container">
        <Link to="/listings" className="back-link">← Back to Listings</Link>

        <div className="item-details-content">
          <div className="item-images">
            {item.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.title} />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
          </div>

          <div className="item-info-section">
            <h1>{item.title}</h1>
            <div className="item-meta">
              <span className="item-category">{item.category}</span>
              <span className="item-condition">{item.condition}</span>
            </div>
            <p className="item-price">${item.price.toFixed(2)}</p>

            <div className="item-description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            <div className="item-actions">
              <button
                className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
              >
                {inWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ItemDetails

