import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, Switch, FormControlLabel,
    IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const API_URL = 'http://localhost:8080/slots';

function SlotList({ useMock = true }) {
    const [slots, setSlots] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [form, setForm] = useState({
        parkingId: '',
        floor: '',
        slot: '',
        isOccupied: false
    });

    const mockData = [
        {
            id: '1',
            parking: { name: 'Parking A' },
            floor: 1,
            slot: 1,
            isOccupied: false,
            lastUpdated: '2025-07-01T15:00:00'
        },
        {
            id: '2',
            parking: { name: 'Parking B' },
            floor: 2,
            slot: 5,
            isOccupied: true,
            lastUpdated: '2025-07-01T15:30:00'
        }
    ];

    const fetchSlots = async () => {
        try {
            const res = await axios.get(API_URL);
            setSlots(res.data);
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    useEffect(() => {
        if (useMock) {
            setSlots(mockData);
        } else {
            fetchSlots();
        }
    }, [useMock]);

    const handleOpen = (slot = null) => {
        setEditingSlot(slot);
        if (slot) {
            setForm({
                parkingId: slot.parking?.id || '',
                floor: slot.floor,
                slot: slot.slot,
                isOccupied: slot.isOccupied
            });
        } else {
            setForm({ parkingId: '', floor: '', slot: '', isOccupied: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingSlot(null);
        setForm({ parkingId: '', floor: '', slot: '', isOccupied: false });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async () => {
        if (useMock) {
            const newSlot = {
                ...form,
                id: editingSlot ? editingSlot.id : `${slots.length + 1}`,
                parking: { name: `Parking ${form.parkingId}` },
                lastUpdated: new Date().toISOString()
            };

            const updated = editingSlot
                ? slots.map((s) => (s.id === editingSlot.id ? newSlot : s))
                : [...slots, newSlot];

            setSlots(updated);
        } else {
            if (editingSlot) {
                await axios.put(`${API_URL}/${editingSlot.id}`, form);
            } else {
                await axios.post(API_URL, form);
            }
            fetchSlots();
        }
        handleClose();
    };

    const handleDelete = async (id) => {
        if (useMock) {
            setSlots(slots.filter((s) => s.id !== id));
        } else {
            await axios.delete(`${API_URL}/${id}`);
            fetchSlots();
        }
        handleMenuClose();
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedSlotId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSlotId(null);
    };

    return (
        <Container sx={{ backgroundColor: '#000', color: '#FFD700', minHeight: '100vh', paddingY: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#FFD700' }}>
                Gestión de Plazas
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: '#FFD700', color: '#000', fontWeight: 'bold' }} onClick={() => handleOpen()}>
                Añadir Plaza
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 2, backgroundColor: '#1a1a1a' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#FFD700' }}>ID</TableCell>
                            <TableCell sx={{ color: '#FFD700' }}>Parking</TableCell>
                            <TableCell sx={{ color: '#FFD700' }}>Planta</TableCell>
                            <TableCell sx={{ color: '#FFD700' }}>Nº Plaza</TableCell>
                            <TableCell sx={{ color: '#FFD700' }}>Ocupada</TableCell>
                            <TableCell sx={{ color: '#FFD700' }}>Última Actualización</TableCell>
                            <TableCell sx={{ color: '#FFD700' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {slots.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell sx={{ color: '#FFD700' }}>{s.id}</TableCell>
                                <TableCell sx={{ color: '#FFD700' }}>{s.parking?.name}</TableCell>
                                <TableCell sx={{ color: '#FFD700' }}>{s.floor}</TableCell>
                                <TableCell sx={{ color: '#FFD700' }}>{s.slot}</TableCell>
                                <TableCell sx={{ color: '#FFD700' }}>{s.isOccupied ? 'Sí' : 'No'}</TableCell>
                                <TableCell sx={{ color: '#FFD700' }}>{s.lastUpdated}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuOpen(e, s.id)}>
                                        <MoreVertIcon sx={{ color: '#FFD700' }} />
                                    </IconButton>
                                    <Menu anchorEl={anchorEl} open={selectedSlotId === s.id} onClose={handleMenuClose}>
                                        <MenuItem onClick={() => { handleOpen(s); handleMenuClose(); }}>Editar</MenuItem>
                                        <MenuItem onClick={() => handleDelete(s.id)}>Eliminar</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a1a1a', color: '#FFD700' } }}>
                <DialogTitle sx={{ color: '#FFD700' }}>{editingSlot ? 'Editar' : 'Crear'} Plaza</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="parkingId"
                        label="ID del Parking"
                        fullWidth
                        value={form.parkingId}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#FFD700' } }}
                        InputProps={{ style: { color: '#FFD700' } }}
                    />
                    <TextField
                        margin="dense"
                        name="floor"
                        label="Planta"
                        type="number"
                        fullWidth
                        value={form.floor}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#FFD700' } }}
                        InputProps={{ style: { color: '#FFD700' } }}
                    />
                    <TextField
                        margin="dense"
                        name="slot"
                        label="Nº Plaza"
                        type="number"
                        fullWidth
                        value={form.slot}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#FFD700' } }}
                        InputProps={{ style: { color: '#FFD700' } }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.isOccupied}
                                onChange={handleChange}
                                name="isOccupied"
                                sx={{ color: '#FFD700' }}
                            />
                        }
                        label="Ocupada"
                        sx={{ color: '#FFD700' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#FFD700' }}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#FFD700', color: '#000' }}>
                        {editingSlot ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SlotList;
