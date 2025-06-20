import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const isAdmin = useSelector((state: RootState) => state.user.userData?.isAdmin);

  if (!isAdmin) {
    return <Navigate replace to={'/'} />;
  }

  return (
    <Outlet />
  )
}

export default AdminLayout;
