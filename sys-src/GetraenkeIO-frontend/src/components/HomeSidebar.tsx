import { useState } from 'react';
import { type MenuItemStyles, Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaWineBottle, FaHistory, FaUser, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { logoutSuccess } from '../features/auth/authSlice';

const CustomSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = useSelector((state: RootState) => state.user.userData?.isAdmin);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/');
  };

  const sidebarBg = '#115293';

  const menuItemStyles: MenuItemStyles = {
    subMenuContent: {
      backgroundColor: sidebarBg,
    },
    button: {
      '&:hover': {
        backgroundColor: '#1976d2',
        color: 'white',
      },
    },
  };

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
      <Sidebar
        collapsed={collapsed}
        backgroundColor={sidebarBg}
        style={{
          color: 'white',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <img src='/beer.png' alt='Logo' style={{ height: 40, objectFit: 'contain' }} />
        </div>

        <Menu menuItemStyles={menuItemStyles}>
          {!collapsed && (
            <div
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                color: '#ccc',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              Allgemein
            </div>
          )}

          <MenuItem icon={<FaWineBottle />} onClick={() => navigate('/drinks')}>
            Getränke
          </MenuItem>
          <MenuItem icon={<FaHistory />} onClick={() => navigate('/purchasehistory')}>
            Kaufverlauf
          </MenuItem>

          {isAdmin && !collapsed && (
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                margin: '0.75rem 1rem 0.5rem',
              }}
            ></div>
          )}

          {isAdmin && (
            <>
              {!collapsed && (
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    color: '#ccc',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}
                >
                  Admin
                </div>
              )}

              <SubMenu label='Admin' icon={<FaUserCog />}>
                <MenuItem onClick={() => navigate('/admin/users')}>Benutzerverwaltung</MenuItem>
                <MenuItem onClick={() => navigate('/admin/stock')}>Bestand</MenuItem>
                <MenuItem onClick={() => navigate('/admin/statistics')}>Statistiken</MenuItem>
              </SubMenu>
            </>
          )}
        </Menu>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
        >
          <div
            style={{
              borderTop: '1px solid rgba(0,0,0,0.3)',
              margin: '0 1rem',
              marginBottom: '0.5rem',
            }}
          ></div>

          <Menu menuItemStyles={menuItemStyles}>
            <MenuItem icon={<FaUser />} onClick={() => navigate('/profile')}>
              Profil
            </MenuItem>
            <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>

      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          top: '0.5rem',
          left: collapsed ? '3.7rem' : '14rem',
          transition: 'left 0.3s ease',
          zIndex: 3,
          backgroundColor: sidebarBg,
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
        }}
        title='Sidebar umschalten'
      >
        {collapsed ? (
          <ArrowForwardIosOutlinedIcon fontSize='small' />
        ) : (
          <ArrowBackIosOutlinedIcon fontSize='small' />
        )}
      </button>
    </div>
  );
};

export default CustomSidebar;
