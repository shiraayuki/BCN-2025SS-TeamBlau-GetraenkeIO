import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');

  const handleRegister = () => {
    console.log('Trying to register');
    // TODO: register logic
  };

  return (
    <Box>
      <Typography variant='h5' fontWeight='bold' mb={2} textAlign='center'>
        Registrieren
      </Typography>
      <TextField
        margin='normal'
        required
        fullWidth
        label='Benutzername'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
      <TextField
        margin='normal'
        required
        fullWidth
        label='Passwort'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
      <TextField
        margin='normal'
        required
        fullWidth
        label='Passwort wiederholen'
        type='password'
        value={repPassword}
        onChange={(e) => setRepPassword(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
      <Button
        fullWidth
        variant='contained'
        sx={{ mt: 3, borderRadius: 2, fontWeight: 'bold' }}
        onClick={handleRegister}
      >
        Registrieren
      </Button>
      <Box mt={2} textAlign='center'>
        <Link to='/login' style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>
          Anmelden
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterForm;
