import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Trying to log in');
    // TODO: login logic
  };

  return (
    <Box
      sx={{
        width: '80%',
        height: '400px',
        p: 4,
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Box
          sx={{ height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <Typography
            variant='h5'
            sx={{
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            Anmelden
          </Typography>
        </Box>
        <Box sx={{ height: '30px' }} />
      </Box>

      <Box>
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          label='Benutzername'
          name='username'
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          name='password'
          label='Passwort'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />
        <Button
          fullWidth
          variant='contained'
          sx={{
            mt: 3,
            mb: 2,
            borderRadius: 2,
            fontWeight: 'bold',
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Link
          to='/register'
          style={{
            textDecoration: 'none',
            fontWeight: 'bold',
            color: '#1976d2',
          }}
        >
          Registrieren
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
