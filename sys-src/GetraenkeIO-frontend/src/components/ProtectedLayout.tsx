import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate replace to={'/login'} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
