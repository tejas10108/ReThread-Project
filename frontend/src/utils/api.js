import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

if (import.meta.env.DEV) {
  console.log('API Base URL:', API_URL)
}

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

