import { Navigate, useOutletContext } from 'react-router'

const DashboardHome = () => {
  const user = useOutletContext()

  return (
    <Navigate
      to={user.role === 'admin' ? '/dashboard/overview' : '/dashboard/orders'}
      replace
    />
  )
}

export default DashboardHome