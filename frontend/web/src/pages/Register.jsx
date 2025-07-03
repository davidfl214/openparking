import { useState } from 'react';
import axios from 'axios';
import {
    Container, Typography, TextField, Button, Paper, Link
} from '@mui/material';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
            alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
            window.location.href = '/login';
        } catch (err) {
            const message = err.response?.data || "Error de conexión con el servidor";
            alert("Error: " + message);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
                    url('https://blog.openstreetmap.org/wp-content/uploads/2023/08/400px-Hedge_End_Coloured.png')
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <img
                    src="https://e7.pngegg.com/pngimages/236/41/png-clipart-illustration-of-map-icon-google-map-maker-google-maps-computer-icons-map-marker-text-heart-thumbnail.png"
                    alt="Logo"
                    style={{ width: 40, height: 40, marginRight: 10 }}
                />
                <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                    OPEN PARKING MAP
                </Typography>
            </div>

            <Container maxWidth="sm">
                <Paper elevation={6} style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nombre completo"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{ marginTop: '1rem' }}
                        >
                            Registrarse
                        </Button>
                    </form>
                    <Typography variant="body2" align="center" style={{ marginTop: '1.5rem' }}>
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/web/src/pages/Login" underline="hover">
                            Inicia sesión
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </div>
    );
}

export default Register;
