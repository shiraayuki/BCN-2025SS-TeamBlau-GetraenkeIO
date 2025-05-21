import { Box, Typography } from '@mui/material';
import RegisterForm from './RegisterForm';
import AuthSidebar from '../../components/AuthSidebar';

const Register = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1976d2',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '800px',
          height: '500px',
          borderRadius: 4,
          boxShadow: 6,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundColor: 'white',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <RegisterForm />
        </Box>
        <AuthSidebar />
      </Box>
    </Box>
  );
};

export default Register;
