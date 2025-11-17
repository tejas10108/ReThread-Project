const { PrismaClient } = require('@prisma/client')

const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_POOL_URL || ''

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})
const gracefulShutdown = async () => {
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

module.exports = prisma

