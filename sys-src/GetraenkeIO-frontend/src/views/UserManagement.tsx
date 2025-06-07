import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import CustomSidebar from "../components/HomeSidebar";

const UserManagement = () => {

  const userData = useSelector((state: RootState) => state.user.userData);

  return (
    <div style={{ display: 'flex', height: '100hv' }}>
      <CustomSidebar />
      <main style={{ flex: 1, padding: '1rem' }}>
        <h1 style={{ marginTop: 0 }}>Benutzerverwaltung</h1>
        <p>Willkommen, {userData?.username}</p>
      </main>
    </div>
  );
}

export default UserManagement;
