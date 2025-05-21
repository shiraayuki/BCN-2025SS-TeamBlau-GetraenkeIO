import { Box } from '@mui/material';
import RegisterForm from './RegisterForm';

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
        {/* Left: Form */}
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

        {/* Right: Logo Panel */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#115293', // etwas dunkleres Blau
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src='/beer.png' alt='Logo' style={{ width: '60%', height: 'auto' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
