import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Navigate, Outlet } from 'react-router-dom';
import CustomSidebar from './HomeSidebar';

const ProtectedLayout = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate replace to={'/login'} />;
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <CustomSidebar />
      <div style={{
        flex: 1,
        overflowY: 'auto',
      }}>
        <Outlet />
      </div>
    </div>
  )
};

export default ProtectedLayout;
