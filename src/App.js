import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
  Backdrop,
  Divider,
  Badge
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';

// Space-themed dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6', // Cosmic blue
    },
    secondary: {
      main: '#ff79b0', // Nebula pink
    },
    background: {
      default: 'transparent',
      paper: 'rgba(18, 18, 30, 0.6)'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 20, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }
});

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount] = useState(3);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (error) {
      showSnackbar(`Authentication error: ${error.message}`, 'error');
    }
  }, [error]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      showSnackbar('Successfully logged out', 'success');
    } catch (err) {
      showSnackbar(`Logout failed: ${err.message}`, 'error');
    }
    handleCloseMenu();
  };

  if (loading) {
    return (
      <Backdrop open sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#000'
      }}>
        <Box textAlign="center">
          <CircularProgress color="primary" size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: '#fff' }}>
            Loading BuddyBeam...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
            url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      />
      
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        color: '#ffffff'
      }}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: 1,
                background: 'linear-gradient(90deg, #64b5f6, #ff79b0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              BuddyBeam
            </Typography>
            
            {user && (
              <>
                <IconButton color="inherit" sx={{ mr: 1 }}>
                  <Badge badgeContent={notificationCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                
                <IconButton size="large" onClick={handleMenu} color="inherit">
                  <Avatar 
                    src={user.photoURL} 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      border: '2px solid #64b5f6'
                    }}
                  />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    sx: {
                      width: 240,
                      backgroundColor: 'rgba(30, 30, 50, 0.9)',
                      backdropFilter: 'blur(20px)',
                      mt: 1.5,
                      border: '1px solid rgba(100, 181, 246, 0.3)',
                      '& .MuiMenuItem-root': {
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(100, 181, 246, 0.1)'
                        }
                      },
                    },
                  }}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="subtitle2">{user.displayName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <MenuItem onClick={handleCloseMenu}>
                    <AccountIcon sx={{ mr: 1.5, color: '#64b5f6' }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1.5, color: '#ff79b0' }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Full-screen message area */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}>
          {user ? (
            <>
              <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                width: '100%',
                p: 2
              }}>
                <MessageList />
              </Box>
              <Box sx={{ 
                width: '100%',
                p: 2,
                backgroundColor: 'rgba(18, 18, 30, 0.7)',
                backdropFilter: 'blur(8px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <MessageInput />
              </Box>
            </>
          ) : (
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
              <Auth />
            </Box>
          )}
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(30, 30, 50, 0.9)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;