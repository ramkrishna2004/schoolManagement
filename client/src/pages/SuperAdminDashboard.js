import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function SuperAdminDashboard() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    contact: '',
    department: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/superadmin/admins', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAdmins(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this admin?')) return;
    try {
      await axios.delete(`/api/superadmin/admins/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAdmins(admins.filter(a => a._id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete admin');
    }
  };

  const handleOpen = () => {
    setForm({ name: '', email: '', password: '', confirmPassword: '', age: '', contact: '', department: '' });
    setFormError('');
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    if (!form.age || form.age < 18) {
      setFormError('Admin must be at least 18 years old');
      return;
    }
    if (!form.contact) {
      setFormError('Please add a contact number');
      return;
    }
    if (!form.department) {
      setFormError('Please add a department');
      return;
    }
    setFormLoading(true);
    try {
      // Call the existing registration endpoint as superadmin
      await axios.post('/api/auth/register/admin', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'admin',
        age: form.age,
        extraDetails: { contact: form.contact, department: form.department }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOpen(false);
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to register admin');
    } finally {
      setFormLoading(false);
    }
  };

  if (!user || user.role !== 'superadmin') {
    return <Typography variant="h5" color="error">Access denied.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>Superadmin Dashboard</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Admin Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add Admin</Button>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.roleId?.extraDetails?.department || '-'}</TableCell>
                    <TableCell>{admin.roleId?.extraDetails?.contact || '-'}</TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => handleDelete(admin._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {/* Add Admin Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit} id="add-admin-form">
            <TextField label="Full Name" name="name" value={form.name} onChange={handleFormChange} fullWidth margin="normal" required />
            <TextField label="Email" name="email" value={form.email} onChange={handleFormChange} fullWidth margin="normal" required type="email" />
            <TextField label="Password" name="password" value={form.password} onChange={handleFormChange} fullWidth margin="normal" required type="password" />
            <TextField label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleFormChange} fullWidth margin="normal" required type="password" />
            <TextField label="Age" name="age" value={form.age} onChange={handleFormChange} fullWidth margin="normal" required type="number" inputProps={{ min: 18 }} />
            <TextField label="Contact Number" name="contact" value={form.contact} onChange={handleFormChange} fullWidth margin="normal" required />
            <TextField label="Department" name="department" value={form.department} onChange={handleFormChange} fullWidth margin="normal" required />
            {formError && <Typography color="error" mt={1}>{formError}</Typography>}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="add-admin-form" variant="contained" disabled={formLoading}>{formLoading ? 'Creating...' : 'Add Admin'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SuperAdminDashboard; 