const express = require('express')
const prisma = require('../utils/prisma')
const verifyToken = require('../middleware/verifyToken')

const router = express.Router()

// GET /api/wishlist - Get user's wishlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    })

    res.json(wishlistItems.map(item => item.product))
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
})

// POST /api/wishlist - Add item to wishlist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    })

    if (existing) {
      return res.status(400).json({ error: 'Item already in wishlist' })
    }

    await prisma.wishlistItem.create({
      data: {
        userId: req.user.userId,
        productId
      }
    })

    res.status(201).json({ message: 'Item added to wishlist' })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    res.status(500).json({ error: 'Failed to add to wishlist' })
  }
})

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    })

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Item not in wishlist' })
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    })

    res.json({ message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    res.status(500).json({ error: 'Failed to remove from wishlist' })
  }
})

module.exports = router

