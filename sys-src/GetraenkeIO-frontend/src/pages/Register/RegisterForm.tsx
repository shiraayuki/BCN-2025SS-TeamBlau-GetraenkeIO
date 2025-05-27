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

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repPasswordError, setRepPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      handleRegister();
    }
  };

  const resetErrors = () => {
    setUsernameError(false);
    setPasswordError(false);
    setRepPasswordError(false);
    setErrorMessage('');
  };

  const handleRegister = async () => {
    resetErrors();

    let hasMissingErrors = false;
    if (!username.trim()) {
      setUsernameError(true);
      hasMissingErrors = true;
    }

    if (!password.trim()) {
      setPasswordError(true);
      hasMissingErrors = true;
    }

    if (!repPassword.trim()) {
      setRepPasswordError(true);
      hasMissingErrors = true;
    }

    if (hasMissingErrors) {
      setErrorMessage('Bitte fülle alle Felder aus');
      return;
    }

    if (password != repPassword) {
      setErrorMessage('Passwörter stimmen nicht überein.');
      setPasswordError(true);
      setRepPasswordError(true);
      return;
    }

    console.log('Trying to register');
    try {
      await authSerive.register({ username: username, password: password });
      const user = await authSerive.login({ username: username, password: password });

      dispatch(loginSuccess(user));
      navigate('/');
    } catch (err) {
      console.error('Register failed' + err);
      setUsernameError(true);
      setPasswordError(true);
      setRepPasswordError(true);
      setErrorMessage('Beutzername oder Passwort ensprechen nicht den Anforderungen.');
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
        error={usernameError}
        onChange={(e) => {
          setUsername(e.target.value);
          resetErrors();
        }}
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
        error={passwordError}
        onChange={(e) => {
          setPassword(e.target.value);
          resetErrors();
        }}
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
        error={repPasswordError}
        onChange={(e) => {
          setRepPassword(e.target.value);
          resetErrors();
        }}
        onKeyDown={handleKeyDown}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      {errorMessage && (
        <Typography variant='body2' color='error'>
          {errorMessage}
        </Typography>
      )}

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
