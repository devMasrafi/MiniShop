import { jwtDecode } from 'jwt-decode'

export const getUser = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const user = jwtDecode(token)

    if (user.exp && user.exp * 1000 <= Date.now()) {
      localStorage.removeItem('token')
      return null
    }

    return user
  } catch {
    localStorage.removeItem('token')
    return null
  }
}

export const isStaff = (user) =>
  user?.role === 'admin' || user?.role === 'employee'
