const express = require('express')
const prisma = require('../utils/prisma')
const verifyToken = require('../middleware/verifyToken')

const router = express.Router()

// GET /api/items - Get all items with filtering, search, pagination
router.get('/', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const search = req.query.search || ''
    const category = req.query.category || ''
    const condition = req.query.condition || ''
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc'

    // Build price filter conditionally
    const priceFilter = {}
    if (minPrice !== null && !isNaN(minPrice)) {
      priceFilter.gte = minPrice
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      priceFilter.lte = maxPrice
    }

    const whereConditions = []
    
    if (search) {
      whereConditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }
    
    if (category) {
      whereConditions.push({ category })
    }
    
    if (condition) {
      whereConditions.push({ condition })
    }
    
    if (Object.keys(priceFilter).length > 0) {
      whereConditions.push({ price: priceFilter })
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {}

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.product.count({ where })
    ])

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// POST /api/items - Create new item (Authenticated)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, category, condition, price, images } = req.body

    if (!title || !description || !category || !condition || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newItem = await prisma.product.create({
      data: {
        title,
        description,
        category,
        condition,
        price: parseFloat(price),
        images: images || []
      }
    })

    res.status(201).json(newItem)
  } catch (error) {
    console.error('Error creating item:', error)
    res.status(500).json({ error: 'Failed to create item' })
  }
})

// GET /api/items/:id - Get single item
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const item = await prisma.product.findUnique({
      where: { id }
    })

    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

// PUT /api/items/:id - Update item (Authenticated)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { title, description, category, condition, price, images } = req.body

    const existingItem = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' })
    }

    const updatedItem = await prisma.product.update({
      where: { id },
      data: {
        title: title || existingItem.title,
        description: description || existingItem.description,
        category: category || existingItem.category,
        condition: condition || existingItem.condition,
        price: price !== undefined ? price : existingItem.price,
        images: images || existingItem.images
      }
    })

    res.json(updatedItem)
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({ error: 'Failed to update item' })
  }
})

// DELETE /api/items/:id - Delete item (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const id = parseInt(req.params.id)
    const item = await prisma.product.findUnique({
      where: { id }
    })

    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    await prisma.product.delete({
      where: { id }
    })

    res.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

module.exports = router

