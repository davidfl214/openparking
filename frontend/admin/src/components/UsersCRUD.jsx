import { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, MenuItem, IconButton,
    Menu, Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function UsersCRUD({ useMock = true }) {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER',
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const mockUsers = [
        { id: 1, name: 'Laura González', email: 'laura@correo.com', password: '123456', role: 'USER' },
        { id: 2, name: 'Miguel Santos', email: 'miguel@correo.com', password: 'abcdef', role: 'ADMIN' }
    ];

    useEffect(() => {
        if (useMock) {
            setUsers(mockUsers);
        }
    }, [useMock]);

    const handleOpen = (user = null) => {
        setEditingUser(user);
        setForm(user || { name: '', email: '', password: '', role: 'USER' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
        setForm({ name: '', email: '', password: '', role: 'USER' });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (useMock) {
            if (editingUser) {
                const updated = users.map(u => u.id === editingUser.id ? { ...u, ...form } : u);
                setUsers(updated);
            } else {
                const newUser = { id: users.length + 1, ...form };
                setUsers([...users, newUser]);
            }
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (useMock) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    const handleEdit = () => {
        const user = users.find(u => u.id === selectedId);
        handleOpen(user);
        handleMenuClose();
    };

    const handleRemove = () => {
        handleDelete(selectedId);
        handleMenuClose();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ color: 'gold' }}>Gestión de Usuarios</Typography>
            <Button variant="contained" onClick={() => handleOpen()} sx={{ backgroundColor: 'gold', color: 'black' }}>
                Añadir Usuario
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 2, backgroundColor: 'black' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'gold' }}>ID</TableCell>
                            <TableCell sx={{ color: 'gold' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'gold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'gold' }}>Rol</TableCell>
                            <TableCell sx={{ color: 'gold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell sx={{ color: 'gold' }}>{u.id}</TableCell>
                                <TableCell sx={{ color: 'gold' }}>{u.name}</TableCell>
                                <TableCell sx={{ color: 'gold' }}>{u.email}</TableCell>
                                <TableCell sx={{ color: 'gold' }}>{u.role}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuOpen(e, u.id)}>
                                        <MoreVertIcon sx={{ color: 'gold' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Editar</MenuItem>
                <MenuItem onClick={handleRemove}>Eliminar</MenuItem>
            </Menu>

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { backgroundColor: 'black', color: 'gold' } }}>
                <DialogTitle>{editingUser ? 'Editar' : 'Crear'} Usuario</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Nombre"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: 'gold' } }}
                        InputProps={{ style: { color: 'gold' } }}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: 'gold' } }}
                        InputProps={{ style: { color: 'gold' } }}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Contraseña"
                        fullWidth
                        value={form.password}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: 'gold' } }}
                        InputProps={{ style: { color: 'gold' } }}
                    />
                    <TextField
                        select
                        margin="dense"
                        name="role"
                        label="Rol"
                        fullWidth
                        value={form.role}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: 'gold' } }}
                        InputProps={{ style: { color: 'gold' } }}
                    >
                        <MenuItem value="USER">USER</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: 'gold' }}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: 'gold', color: 'black' }}>
                        {editingUser ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default UsersCRUD;
