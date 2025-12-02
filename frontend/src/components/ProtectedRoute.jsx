import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user')
  const accessToken = localStorage.getItem('accessToken')

  if (!user || !accessToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

