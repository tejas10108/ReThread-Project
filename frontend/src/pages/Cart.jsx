import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 })
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    setLoading(true)
    try {
      const response = await api.get('/cart')
      setCart(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }

    try {
      await api.put(`/cart/${itemId}`, { quantity: newQuantity })
      fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`)
      fetchCart()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <div className="loading">Loading cart...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>{cart.count} {cart.count === 1 ? 'item' : 'items'}</p>
        </div>

        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/listings" className="browse-link">Browse Listings →</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item.id} className="cart-item-card">
                  <Link to={`/item/${item.productId}`} className="cart-item-link">
                    <div className="cart-item-image">
                      {item.product.images && item.product.images[0] ? (
                        <img src={item.product.images[0]} alt={item.product.title} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                  </Link>
                  <div className="cart-item-details">
                    <h3>{item.product.title}</h3>
                    <p className="cart-item-category">{item.product.category}</p>
                    <p className="cart-item-condition">{item.product.condition}</p>
                    <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <p className="item-total">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
              <p className="checkout-note">Secure checkout • Free returns within 14 days</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart

