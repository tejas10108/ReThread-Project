import axios from 'axios'

// Get API URL from environment variable
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// Ensure API_URL ends with /api
if (!API_URL.endsWith('/api')) {
  // Remove trailing slash if present, then add /api
  API_URL = API_URL.replace(/\/$/, '') + '/api'
}

// Log in both dev and production to help debug
console.log('🔧 API Configuration:', {
  'VITE_API_URL (raw)': import.meta.env.VITE_API_URL || 'NOT SET',
  'Final API_URL': API_URL,
  'Mode': import.meta.env.MODE
})

// Shorter timeout for localhost, longer for production
const isLocalhost = API_URL.includes('localhost') || API_URL.includes('127.0.0.1')
const timeout = isLocalhost ? 10000 : 30000

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: timeout
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  
  if (accessToken) {
    config.headers.Authorization = `JWT ${accessToken}`
  }
  
  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken
  }
  
  return config
})

api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers['x-access-token']
    const newRefreshToken = response.headers['x-refresh-token']
    
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken)
    }
    
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken)
    }
    
    return response
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    })
    return Promise.reject(error)
  }
)

export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }
}

export default api

