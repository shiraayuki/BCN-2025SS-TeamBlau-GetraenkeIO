import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { authSerive } from '../../features/auth/authService';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      handleLogin();
    }
  };

  const resetErrors = () => {
    setUsernameError(false);
    setPasswordError(false);
    setErrorMessage('');
  };

  const handleLogin = async () => {
    resetErrors();

    let hasErrors = false;
    if (!username.trim()) {
      setUsernameError(true);
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasErrors = true;
    }

    if (hasErrors) {
      setErrorMessage('Bitte fülle beide Felder aus');
      return;
    }

    console.log('Trying to log in');
    try {
      const user = await authSerive.login({ username: username, password: password });
      dispatch(loginSuccess(user));
      navigate('/');
    } catch {
      setUsernameError(true);
      setPasswordError(true);
      setErrorMessage('Benutername oder Password falsch.');
      setPassword('');
      console.error('Login failed!');
    }
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
      <Typography
        variant='h5'
        sx={{
          fontWeight: 'bold',
        }}
      >
        Anmelden
      </Typography>

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
          error={usernameError}
          onChange={(e) => {
            setUsername(e.target.value);
            resetErrors();
          }}
          onKeyDown={handleKeyDown}
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
          error={passwordError}
          onChange={(e) => {
            setPassword(e.target.value);
            resetErrors();
          }}
          onKeyDown={handleKeyDown}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />

        {errorMessage && (
          <Typography variant='body2' color='error'>
            {errorMessage}
          </Typography>
        )}
      </Box>

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
