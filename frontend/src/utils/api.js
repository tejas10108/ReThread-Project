import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

