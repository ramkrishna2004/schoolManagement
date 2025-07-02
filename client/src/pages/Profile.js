import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, Button, Typography, Box, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { Edit, Lock, Email, AssignmentInd, Save } from '@mui/icons-material';

import api from '../config/api';


function Profile() {
  const { user, updateUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [form, setForm] = useState({ name: '', avatar: '' });
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');
  const [success, setSuccess] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  // Handlers for edit dialog
  const handleEditOpen = () => {
    setForm({
      name: user?.name || '',
      avatar: user?.avatar || ''
    });
    setError('');
    setSuccess('');
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setError('');
    setSuccess('');
  };

  const handleEditChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/api/auth/profile', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Update user context
        updateUser(response.data.data);
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          setEditOpen(false);
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for password dialog
  const handlePwOpen = () => {
    setPwForm({ current: '', new: '', confirm: '' });
    setPwError('');
    setPwSuccess('');
    setPwOpen(true);
  };

  const handlePwClose = () => {
    setPwOpen(false);
    setPwError('');
    setPwSuccess('');
  };

  const handlePwChange = e => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handlePwSubmit = async e => {
    e.preventDefault();
    
    if (pwForm.new !== pwForm.confirm) {
      setPwError('New passwords do not match');
      return;
    }

    if (pwForm.new.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }

    setPwLoading(true);
    setPwError('');
    setPwSuccess('');

    try {
      const response = await api.put('/api/auth/password', {
        currentPassword: pwForm.current,
        newPassword: pwForm.new
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setPwSuccess('Password changed successfully!');
        setPwForm({ current: '', new: '', confirm: '' });
        setTimeout(() => {
          setPwOpen(false);
          setPwSuccess('');
        }, 2000);
      }
    } catch (err) {
      setPwError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-white px-4 py-8">
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 5, boxShadow: 6, p: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar 
              src={user?.avatar} 
              sx={{ 
                width: 90, 
                height: 90, 
                bgcolor: 'primary.main', 
                fontSize: 40,
                border: '3px solid white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" className="flex items-center gap-1">
              <Email fontSize="small" /> {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
              <AssignmentInd fontSize="small" /> Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box display="flex" flexDirection="column" gap={2}>
            <Button 
              variant="outlined" 
              startIcon={<Edit />} 
              onClick={handleEditOpen} 
              fullWidth 
              sx={{ borderRadius: 3, fontWeight: 600 }}
            >
              Edit Profile
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={<Lock />} 
              onClick={handlePwOpen} 
              fullWidth 
              sx={{ borderRadius: 3, fontWeight: 600 }}
            >
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField 
              label="Name" 
              name="name" 
              value={form.name} 
              onChange={handleEditChange} 
              fullWidth 
              required 
              disabled={loading}
            />
            <TextField 
              label="Avatar URL" 
              name="avatar" 
              value={form.avatar} 
              onChange={handleEditChange} 
              fullWidth 
              placeholder="https://example.com/avatar.jpg"
              disabled={loading}
              helperText="Enter a valid image URL for your profile picture"
            />
            {form.avatar && (
              <Box display="flex" justifyContent="center" mt={1}>
                <Avatar 
                  src={form.avatar} 
                  sx={{ width: 60, height: 60 }}
                >
                  {form.name?.[0]?.toUpperCase()}
                </Avatar>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              startIcon={loading ? null : <Save />}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={pwOpen} onClose={handlePwClose} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handlePwSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pwSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {pwSuccess}
              </Alert>
            )}
            {pwError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {pwError}
              </Alert>
            )}
            <TextField 
              label="Current Password" 
              name="current" 
              type="password" 
              value={pwForm.current} 
              onChange={handlePwChange} 
              fullWidth 
              required 
              disabled={pwLoading}
            />
            <TextField 
              label="New Password" 
              name="new" 
              type="password" 
              value={pwForm.new} 
              onChange={handlePwChange} 
              fullWidth 
              required 
              disabled={pwLoading}
              helperText="Password must be at least 6 characters"
            />
            <TextField 
              label="Confirm New Password" 
              name="confirm" 
              type="password" 
              value={pwForm.confirm} 
              onChange={handlePwChange} 
              fullWidth 
              required 
              disabled={pwLoading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePwClose} disabled={pwLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="secondary" 
              disabled={pwLoading}
              startIcon={pwLoading ? null : <Lock />}
            >
              {pwLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Profile; 