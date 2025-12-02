const express = require('express')
const prisma = require('../utils/prisma')
const verifyToken = require('../middleware/verifyToken')

const router = express.Router()

// GET /api/cart - Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    })

    const items = cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product
    }))

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    res.json({
      items,
      total: parseFloat(total.toFixed(2)),
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

// POST /api/cart - Add item to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId: parseInt(productId)
        }
      }
    })

    let cartItem
    if (existingItem) {
      // Update quantity if item already exists
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
        include: { product: true }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.userId,
          productId: parseInt(productId),
          quantity: parseInt(quantity)
        },
        include: { product: true }
      })
    }

    res.status(201).json({
      message: 'Item added to cart',
      item: {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        product: cartItem.product
      }
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
})

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', verifyToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' })
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    })

    if (!cartItem || cartItem.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) },
      include: { product: true }
    })

    res.json({
      message: 'Cart item updated',
      item: {
        id: updatedItem.id,
        productId: updatedItem.productId,
        quantity: updatedItem.quantity,
        product: updatedItem.product
      }
    })
  } catch (error) {
    console.error('Error updating cart item:', error)
    res.status(500).json({ error: 'Failed to update cart item' })
  }
})

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', verifyToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId }
    })

    if (!cartItem || cartItem.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    res.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
})

module.exports = router

