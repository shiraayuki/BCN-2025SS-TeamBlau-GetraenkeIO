import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authSerive } from '../../features/auth/authService';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    console.log('Trying to register');
    if (password != repPassword) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }

    try {
      await authSerive.register({ username: username, password: password });
      const user = await authSerive.login({ username: username, password: password });

      dispatch(loginSuccess(user));
      navigate('/');
    } catch (err) {
      console.error('Register failed' + err);
    }
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
        onKeyDown={handleKeyDown}
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
        onKeyDown={handleKeyDown}
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
        onKeyDown={handleKeyDown}
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
        <Typography variant='body2'>Bereits Registiert?</Typography>
        <Link to='/login' style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>
          Anmelden
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterForm;
