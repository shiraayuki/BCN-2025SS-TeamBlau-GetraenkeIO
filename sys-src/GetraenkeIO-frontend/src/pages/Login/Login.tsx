import LoginForm from './LoginFrom';
import LoginSidebar from './LoginSidebar';
import { Box } from '@mui/material';

const Login = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <LoginSidebar />
      <Box
        sx={{
          flex: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
};

export default Login;
