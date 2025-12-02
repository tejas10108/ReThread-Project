require('dotenv').config()

if (!process.env.DATABASE_URL) {
  console.error('\n❌ Error: DATABASE_URL not found in environment variables!')
  console.error('\nTo fix this:')
  console.error('1. Open backend/.env file')
  console.error('2. Uncomment the DATABASE_URL line (remove the #)')
  console.error('3. Make sure it points to your PostgreSQL database')
  console.error('\nExample:')
  console.error('DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"\n')
  process.exit(1)
}

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const sampleProducts = [
  {
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket with a worn-in look. Perfect for layering.',
    category: 'upper',
    condition: 'Gently Used',
    price: 45.99,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Oversized Graphic Tee',
    description: 'Comfortable cotton t-shirt with vintage graphic print. Soft and breathable.',
    category: 'upper',
    condition: 'Like New',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Classic White Button Shirt',
    description: 'Crisp white button-down shirt, perfect for casual or formal occasions.',
    category: 'upper',
    condition: 'New',
    price: 35.99,
    images: ['https://images.unsplash.com/photo-1594938291221-94f18cbb7080?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Cozy Knit Sweater',
    description: 'Warm and soft knit sweater in neutral tones. Great for winter.',
    category: 'upper',
    condition: 'Gently Used',
    price: 42.99,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Hooded Zip-Up Sweatshirt',
    description: 'Comfortable hoodie with front zip. Perfect for casual wear.',
    category: 'upper',
    condition: 'Like New',
    price: 38.99,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Striped Long Sleeve Shirt',
    description: 'Classic striped shirt with long sleeves. Versatile and stylish.',
    category: 'upper',
    condition: 'Gently Used',
    price: 28.99,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Slim Fit Jeans',
    description: 'Dark wash slim fit jeans. Comfortable and stylish.',
    category: 'lower',
    condition: 'Like New',
    price: 55.99,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Cargo Pants',
    description: 'Functional cargo pants with multiple pockets. Durable and practical.',
    category: 'lower',
    condition: 'Gently Used',
    price: 48.99,
    images: ['https://images.unsplash.com/photo-1506629905607-0c4c0b0c0b0b?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Chino Trousers',
    description: 'Classic chino pants in beige. Perfect for smart casual looks.',
    category: 'lower',
    condition: 'New',
    price: 52.99,
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Jogger Pants',
    description: 'Comfortable jogger pants with elastic cuffs. Great for active wear.',
    category: 'lower',
    condition: 'Like New',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5da?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Baseball Cap',
    description: 'Classic baseball cap with adjustable strap. Perfect for sunny days.',
    category: 'accessories',
    condition: 'Gently Used',
    price: 18.99,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Leather Belt',
    description: 'Genuine leather belt with classic buckle. Durable and timeless.',
    category: 'accessories',
    condition: 'Like New',
    price: 32.99,
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583fd?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Canvas Sneakers',
    description: 'Classic canvas sneakers in white. Comfortable and versatile.',
    category: 'footwear',
    condition: 'Gently Used',
    price: 44.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Leather Boots',
    description: 'Stylish leather boots with good grip. Perfect for autumn and winter.',
    category: 'footwear',
    condition: 'Like New',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1605812860427-4024433a70fd?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Winter Parka',
    description: 'Warm winter parka with hood. Excellent for cold weather.',
    category: 'winterwear',
    condition: 'Gently Used',
    price: 125.99,
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Wool Scarf',
    description: 'Soft wool scarf in plaid pattern. Keeps you warm and stylish.',
    category: 'winterwear',
    condition: 'Like New',
    price: 28.99,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83d94954?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Kurta Set',
    description: 'Traditional Indian kurta set in elegant design. Perfect for festive occasions.',
    category: 'ethnic',
    condition: 'New',
    price: 65.99,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80']
  },
  {
    title: 'Saree',
    description: 'Beautiful traditional saree with intricate patterns. Elegant and timeless.',
    category: 'ethnic',
    condition: 'Like New',
    price: 95.99,
    images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=800&q=80']
  }
]

async function main() {
  console.log('Starting seed...')
  console.log('Connecting to database...')

  // Test database connection first
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!\n')
  } catch (error) {
    console.error('\n❌ Cannot connect to database!')
    console.error('\nPossible issues:')
    console.error('1. Database server might be down or unreachable')
    console.error('2. Network connectivity issues')
    console.error('3. Incorrect DATABASE_URL in .env file')
    console.error('4. Database might require IP whitelisting')
    console.error('\nCurrent DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    console.error('\nTry:')
    console.error('- Verify DATABASE_URL in backend/.env file')
    console.error('- Check if database is accessible')
    console.error('- Run: npx prisma generate (to regenerate Prisma client)\n')
    throw error
  }

  // Clear existing products
  await prisma.product.deleteMany({})
  console.log('Cleared existing products')

  // Create sample products
  for (const product of sampleProducts) {
    await prisma.product.create({
      data: product
    })
    console.log(`Created: ${product.title}`)
  }

  console.log(`\n✅ Seeded ${sampleProducts.length} products successfully!`)
}

main()
  .catch((e) => {
    console.error('Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

