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
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 3,
      }}
    >
      {/* Titel */}
      <Typography
        variant='h5'
        sx={{
          fontWeight: 'bold',
        }}
      >
        Anmelden
      </Typography>

      {/* Eingabefelder */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
      </Box>

      {/* Login Button */}
      <Button
        fullWidth
        variant='contained'
        sx={{
          mt: 1,
          borderRadius: 2,
          fontWeight: 'bold',
        }}
        onClick={handleLogin}
      >
        Anmelden
      </Button>

      {/* Link zur Registrierung */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          px: 1,
          fontSize: '0.9rem',
        }}
      >
        <Typography variant='body2'>Noch keinen Account?</Typography>
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
