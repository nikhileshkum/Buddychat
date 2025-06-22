import React, { useState, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import { 
  TextField, 
  Button, 
  Box, 
  IconButton,
  CircularProgress,
  Badge,
  Typography,
  Tooltip,
  Alert,
  Collapse
} from '@mui/material';
import { 
  Send as SendIcon, 
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function MessageInput() {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImage(file);
    setError(null);
  };

  const handleUploadImage = async () => {
    if (!image) return null;
    
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `chat_images/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError('Image upload failed. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '' && !image) return;

    try {
      const imageUrl = image ? await handleUploadImage() : null;
      
      if (image && !imageUrl) return; // Don't send if image failed to upload

      await addDoc(collection(db, 'messages'), {
        text: message,
        sender: auth.currentUser?.displayName || 'Anonymous',
        senderId: auth.currentUser?.uid,
        photoURL: auth.currentUser?.photoURL,
        imageUrl,
        timestamp: serverTimestamp()
      });

      setMessage('');
      setImage(null);
    } catch (err) {
      console.error('Message send error:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      bgcolor: 'background.paper',
      borderTop: '1px solid',
      borderColor: 'divider'
    }}>
      {/* Error Alert */}
      <Collapse in={Boolean(error)}>
        <Alert
          severity="error"
          action={
            <IconButton
              size="small"
              onClick={() => setError(null)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 1 }}
        >
          {error}
        </Alert>
      </Collapse>

      <Box 
        component="form" 
        onSubmit={sendMessage}
        sx={{ 
          display: 'flex', 
          gap: 1, 
          p: 2,
          alignItems: 'center'
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        
        <Tooltip title="Attach image">
          <IconButton 
            color="primary"
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
          >
            <Badge 
              color="error" 
              variant="dot" 
              invisible={!image}
            >
              {isUploading ? (
                <CircularProgress size={24} />
              ) : (
                <AttachFileIcon />
              )}
            </Badge>
          </IconButton>
        </Tooltip>

        <TextField
          fullWidth
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isUploading}
          InputProps={{
            endAdornment: image && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 1,
                maxWidth: 150,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <ImageIcon color="primary" sx={{ mr: 1, flexShrink: 0 }} />
                <Typography 
                  variant="caption" 
                  noWrap
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  {image.name}
                </Typography>
              </Box>
            ),
            sx: {
              borderRadius: 4,
              backgroundColor: 'background.default'
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          disabled={isUploading || (message.trim() === '' && !image)}
          sx={{
            borderRadius: 4,
            px: 3,
            py: 1.5,
            minWidth: 100
          }}
        >
          {isUploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send'
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default MessageInput;