// src/pages/admin/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import axios from 'axios';

const roles = ['USER', 'ADMIN'];

function UsersList() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:8080/api/users');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpen = (user = null) => {
        setEditingUser(user);
        setFormData(user ? {
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        } : {
            name: '',
            email: '',
            password: '',
            role: 'USER'
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async () => {
        if (editingUser) {
            await axios.put(`http://localhost:8081/api/users/${editingUser.id}`, formData);
        } else {
            await axios.post('http://localhost:8081/api/users', formData);
        }
        fetchUsers();
        handleClose();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8081/api/users/${id}`);
        fetchUsers();
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 2, color: '#FFD700' }}>Gestión de Usuarios</Typography>
            <Button variant="contained" color="warning" onClick={() => handleOpen()}>
                Crear Usuario
            </Button>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button color="warning" onClick={() => handleOpen(user)}>Editar</Button>
                                    <Button color="error" onClick={() => handleDelete(user.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="dense"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="dense"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <TextField
                        select
                        label="Rol"
                        fullWidth
                        margin="dense"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} color="warning">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default UsersList;
