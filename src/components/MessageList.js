import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { 
  List, 
  ListItem, 
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Image as ImageIcon,
  Person as PersonIcon 
} from '@mui/icons-material';

function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch messages with real-time updates
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })).reverse(); // Reverse to show newest at bottom

      setMessages(messagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format message time
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is from current user
  const isCurrentUser = (senderId) => {
    return auth.currentUser?.uid === senderId;
  };

  return (
    <Box sx={{ 
      flex: 1,
      overflow: 'auto',
      p: 2,
      bgcolor: 'background.default'
    }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Typography 
          variant="body1" 
          color="textSecondary"
          sx={{ textAlign: 'center', mt: 4 }}
        >
          No messages yet. Send the first one!
        </Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem 
                sx={{
                  justifyContent: isCurrentUser(message.senderId) ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  px: 1,
                  py: 0.5
                }}
              >
                {!isCurrentUser(message.senderId) && (
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar 
                      src={message.photoURL} 
                      sx={{ width: 32, height: 32 }}
                    >
                      {!message.photoURL && <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                )}

                <Box sx={{ 
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isCurrentUser(message.senderId) ? 'flex-end' : 'flex-start'
                }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isCurrentUser(message.senderId) 
                        ? 'primary.main' 
                        : 'background.paper',
                      color: isCurrentUser(message.senderId) 
                        ? 'primary.contrastText' 
                        : 'text.primary',
                      border: isCurrentUser(message.senderId) 
                        ? 'none' 
                        : '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {message.imageUrl ? (
                      <Box sx={{ mb: 1 }}>
                        <img 
                          src={message.imageUrl} 
                          alt="Uploaded content"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '300px',
                            borderRadius: '8px'
                          }}
                        />
                        {message.text && (
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {message.text}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body1">
                        {message.text}
                      </Typography>
                    )}

                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        textAlign: 'right',
                        color: isCurrentUser(message.senderId) 
                          ? 'primary.contrastText' 
                          : 'text.secondary',
                        mt: 0.5
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Paper>

                  {!isCurrentUser(message.senderId) && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      {message.sender}
                    </Typography>
                  )}
                </Box>

                {isCurrentUser(message.senderId) && (
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar 
                      src={auth.currentUser?.photoURL} 
                      sx={{ width: 32, height: 32 }}
                    >
                      {!auth.currentUser?.photoURL && <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      )}
    </Box>
  );
}

export default MessageList;