import { useContext, useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Switch,
    FormControlLabel,
    Menu,
    MenuItem,
    IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { DataContext } from "../context/DataContext";

const PARKING_MICROSERVICE_BASE_URL =
    import.meta.env.VITE_PARKING_MICROSERVICE_URL || "http://localhost:8080";

function ParkingList({ useMock = true }) {
    const [parkings, setParkings] = useState([]);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedParking, setSelectedParking] = useState(null);
    const [editingParking, setEditingParking] = useState(null);
    const [form, setForm] = useState({
        name: "",
        administratorEmail: "",
        location: "",
        numberOfFloors: "",
        slotsPerFloor: "",
        enabled: false,
    });
    const { isMobile } = useContext(DataContext);

    const mockData = [
        {
            id: "1",
            name: "Parking Central",
            administratorEmail: "admin@central.com",
            location: "Bilbao Centro",
            numberOfFloors: 3,
            slotsPerFloor: 40,
            enabled: true,
        },
        {
            id: "2",
            name: "Parking Norte",
            administratorEmail: "admin@norte.com",
            location: "Bilbao Norte",
            numberOfFloors: 2,
            slotsPerFloor: 30,
            enabled: false,
        },
    ];

    const fetchParkings = async () => {
        try {
            const res = await fetch(
                `${PARKING_MICROSERVICE_BASE_URL}/parkings`
            );
            if (!res.ok) {
                throw new Error(res.statusText || "Error mientras se obtenían los parkings");
            }
            const data = await res.json();
            setParkings(data);
        } catch (err: any) {
            Swal.fire({
                toast: true,
                position: isMobile ? "top" : "top-end",
                icon: "error",
                title: "<strong>Algo ha fallado</strong>",
                text: err.message || null,
                showConfirmButton: false,
                timer: 3000,
                background: "#fef2f2",
                color: "#991b1b",
                timerProgressBar: true,
            });
        }
    };

    useEffect(() => {
        if (useMock) {
            setParkings(mockData);
        } else {
            fetchParkings();
        }
    }, [useMock]);

    const handleOpen = (parking = null) => {
        setEditingParking(parking);
        setForm(
            parking || {
                name: "",
                administratorEmail: "",
                location: "",
                numberOfFloors: "",
                slotsPerFloor: "",
                enabled: false,
            }
        );
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingParking(null);
        setForm({
            name: "",
            administratorEmail: "",
            location: "",
            numberOfFloors: "",
            slotsPerFloor: "",
            enabled: false,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleToggle = () => {
        setForm({ ...form, enabled: !form.enabled });
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            numberOfFloors: parseInt(form.numberOfFloors),
            slotsPerFloor: parseInt(form.slotsPerFloor),
        };

        if (useMock) {
            if (editingParking) {
                const updated = parkings.map((p) =>
                    p.id === editingParking.id ? { ...p, ...payload } : p
                );
                setParkings(updated);
            } else {
                const newParking = {
                    id: (parkings.length + 1).toString(),
                    ...payload,
                };
                setParkings([...parkings, newParking]);
            }
        } else {
            if (editingParking) {
                await axios.put(`${API_URL}/${editingParking.id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            fetchParkings();
        }

        handleClose();
    };

    const handleMenuOpen = (event, parking) => {
        setAnchorEl(event.currentTarget);
        setSelectedParking(parking);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedParking(null);
    };

    const handleDelete = async () => {
        if (useMock) {
            setParkings(parkings.filter((p) => p.id !== selectedParking.id));
        } else {
            await axios.delete(`${API_URL}/${selectedParking.id}`);
            fetchParkings();
        }
        handleMenuClose();
    };

    return (
        <Container
            sx={{
                backgroundColor: "#000",
                minHeight: "100vh",
                color: "#FFD700",
                py: 4,
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "#FFD700", fontWeight: "bold" }}
            >
                Gestión de Parkings
            </Typography>
            <Button
                variant="contained"
                sx={{ backgroundColor: "#FFD700", color: "#000", mb: 2 }}
                onClick={() => handleOpen()}
            >
                Añadir Parking
            </Button>

            <TableContainer
                component={Paper}
                sx={{ backgroundColor: "#111", color: "#FFD700" }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "#FFD700" }}>ID</TableCell>
                            <TableCell sx={{ color: "#FFD700" }}>
                                Nombre
                            </TableCell>
                            <TableCell sx={{ color: "#FFD700" }}>
                                Email Admin
                            </TableCell>
                            <TableCell sx={{ color: "#FFD700" }}>
                                Ubicación
                            </TableCell>
                            <TableCell sx={{ color: "#FFD700" }}>
                                Plantas
                            </TableCell>
                            <TableCell sx={{ color: "#FFD700" }}>
                                Plazas/Planta
                            </TableCell>
                            <TableCell sx={{ color: "#FFD700" }}>
                                Activo
                            </TableCell>
                            <TableCell sx={{ color: "#FFD700" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parkings.map((p) => (
                            <TableRow key={p.id} sx={{ color: "#FFD700" }}>
                                <TableCell sx={{ color: "#FFD700" }}>
                                    {p.id}
                                </TableCell>
                                <TableCell sx={{ color: "#FFD700" }}>
                                    {p.name}
                                </TableCell>
                                <TableCell sx={{ color: "#FFD700" }}>
                                    {p.administratorEmail}
                                </TableCell>
                                <TableCell sx={{ color: "#FFD700" }}>
                                    {p.location}
                                </TableCell>
                                <TableCell sx={{ color: "#FFD700" }}>
                                    {p.numberOfFloors}
                                </TableCell>
                                <TableCell sx={{ color: "#FFD700" }}>
                                    {p.slotsPerFloor}
                                </TableCell>
                                <TableCell sx={{ color: "#FFD700" }}>
                                    {p.enabled ? "Sí" : "No"}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={(e) => handleMenuOpen(e, p)}
                                        sx={{ color: "#FFD700" }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        handleOpen(selectedParking);
                        handleMenuClose();
                    }}
                >
                    Editar
                </MenuItem>
                <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
            </Menu>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { backgroundColor: "#111", color: "#FFD700" },
                }}
            >
                <DialogTitle sx={{ color: "#FFD700" }}>
                    {editingParking ? "Editar" : "Crear"} Parking
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        name="name"
                        label="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        sx={{
                            input: { color: "#FFD700" },
                            label: { color: "#FFD700" },
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        name="administratorEmail"
                        label="Email del Administrador"
                        value={form.administratorEmail}
                        onChange={handleChange}
                        sx={{
                            input: { color: "#FFD700" },
                            label: { color: "#FFD700" },
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        name="location"
                        label="Ubicación"
                        value={form.location}
                        onChange={handleChange}
                        sx={{
                            input: { color: "#FFD700" },
                            label: { color: "#FFD700" },
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        name="numberOfFloors"
                        label="Número de Plantas"
                        type="number"
                        value={form.numberOfFloors}
                        onChange={handleChange}
                        sx={{
                            input: { color: "#FFD700" },
                            label: { color: "#FFD700" },
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        name="slotsPerFloor"
                        label="Plazas por Planta"
                        type="number"
                        value={form.slotsPerFloor}
                        onChange={handleChange}
                        sx={{
                            input: { color: "#FFD700" },
                            label: { color: "#FFD700" },
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={form.enabled}
                                onChange={handleToggle}
                            />
                        }
                        label="¿Activo?"
                        sx={{ mt: 2, color: "#FFD700" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: "#FFD700" }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ backgroundColor: "#FFD700", color: "#000" }}
                    >
                        {editingParking ? "Actualizar" : "Crear"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ParkingList;
