const users = []
let nextId = 1

const localDB = {
  findUserByEmail: (email) => {
    return users.find(user => user.email === email) || null
  },

  findUserById: (id) => {
    return users.find(user => user.id === id) || null
  },

  createUser: (userData) => {
    const user = {
      id: nextId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    users.push(user)
    return user
  },

  getAllUsers: () => {
    return users
  },

  clearAll: () => {
    users.length = 0
    nextId = 1
  }
}

module.exports = localDB