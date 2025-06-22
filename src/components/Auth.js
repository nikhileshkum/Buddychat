// src/components/Auth.js
import React from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  Button, 
  Avatar, 
  Typography, 
  Box, 
  Divider 
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

function Auth() {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      p: 3,
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      maxWidth: 400,
      mx: 'auto',
      mt: 4
    }}>
      {auth.currentUser ? (
        <>
          <Avatar
            src={auth.currentUser.photoURL}
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="h6">
            Welcome, {auth.currentUser.displayName}!
          </Typography>
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleSignOut}
            sx={{ mt: 2 }}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Welcome to ChatApp
          </Typography>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            size="large"
            sx={{
              bgcolor: '#4285F4',
              '&:hover': { bgcolor: '#3367D6' }
            }}
          >
            Continue with Google
          </Button>
          <Divider sx={{ width: '100%', my: 2 }}>OR</Divider>
          <Typography variant="body2" color="textSecondary">
            Other login methods coming soon
          </Typography>
        </>
      )}
    </Box>
  );
}

export default Auth;