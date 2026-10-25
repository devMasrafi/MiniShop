import { Navigate, Outlet, useOutletContext } from 'react-router'

const RequireRole = ({ roles }) => {
  const user = useOutletContext()

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet context={user} />
}

export default RequireRole
