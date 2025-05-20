import { Box, Typography } from '@mui/material';

const LoginSidebar = () => {
  return (
    <Box
      sx={{
        flex: 2,
        backgroundColor: '#1976d2',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 4,
        textAlign: 'center',
      }}
    >
      <Typography
        variant='h3'
        sx={{
          fontWeight: 'bold',
          mb: 2,
          marginBottom: '50px',
        }}
      >
        GetraenkeIO
      </Typography>
      <img src='/beer.png' alt='Logo' style={{ width: '400px', marginBottom: '40px' }} />
      <Typography variant='h6'>Deine smarte Getränkebuchungssoftware</Typography>
    </Box>
  );
};

export default LoginSidebar;
