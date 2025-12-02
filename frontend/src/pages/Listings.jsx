import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import './Listings.css'

function Listings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const categories = ['upper', 'lower', 'accessories', 'footwear', 'winterwear', 'ethnic']
  const conditions = ['New', 'Like New', 'Gently Used', 'Used', 'Fair']

  const fetchItems = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      })

      const response = await api.get(`/items?${params}`)
      setItems(response.data.items)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems(1)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePageChange = (newPage) => {
    fetchItems(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/cart', { productId, quantity: 1 })
      alert('Item added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart')
    }
  }

  return (
    <>
      <Navbar />
      <div className="listings-container">
        <div className="listings-header">
          <h1>Browse Listings</h1>
          <p>Discover pre-loved fashion finds</p>
        </div>

        <div className="filters-horizontal">
          <h3 className="filters-title">Filters</h3>
          <div className="filters-row">
            <div className="filter-item">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
              >
                <option value="">All Conditions</option>
                {conditions.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div className="filter-item price-filter">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-item">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
                <option value="title">Name</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        <main className="listings-main">
            <div className="search-bar-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {loading ? (
              <div className="loading">Loading items...</div>
            ) : items.length === 0 ? (
              <div className="empty-state">No items found. Try adjusting your filters.</div>
            ) : (
              <>
                <div className="items-grid">
                  {items.map(item => (
                    <div key={item.id} className="item-card">
                      <Link
                        to={`/item/${item.id}`}
                        className="item-link"
                      >
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
                        className="item-add-to-cart"
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(item.id)
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                    <span>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
      </div>
    </>
  )
}

export default Listings

