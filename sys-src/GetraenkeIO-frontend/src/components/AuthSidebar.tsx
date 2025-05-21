import { Box, Typography } from '@mui/material';

const AuthSidebar = () => {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: '#115293',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        p: 3,
        gap: 4,
      }}
    >
      <Typography
        variant='h4'
        sx={{
          fontWeight: 'bold',
        }}
      >
        GetränkeIO
      </Typography>
      <img src='/beer.png' alt='Logo' style={{ width: '70%', maxWidth: '300px', height: 'auto' }} />
    </Box>
  );
};

export default AuthSidebar;
