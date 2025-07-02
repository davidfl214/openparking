/*
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            // Cambiar la comprobación:
            if (data === 'ADMIN') {
                alert("Bienvenido admin");
                window.location.href = '/map';
            }
            else {
                alert("No tienes permisos de usuario");
            }
        } catch (err) {
            if (err instanceof Error) {
                alert("Error: " + err.message);
            } else {
                alert("Error desconocido");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login Usuario</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
        </form>
    );
}

export default Login;
*/

import { useState } from 'react';
import axios from 'axios';
import {
    Container, Typography, TextField, Button, Paper
} from '@mui/material';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });

            const { token, role } = res.data;

            if (role === 'ADMIN') {
                localStorage.setItem('jwt', token);
                alert("Inicio de sesión exitoso como administrador");
                window.location.href = '/admin-home';
            } else {
                alert("No tienes permisos de administrador");
            }
        } catch (err) {
            const message = err.response?.data || "Error de conexión con el servidor";
            alert("Error: " + message);
        }
    };

    return (
        <div
            style={{
                backgroundColor: '#000000',
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
                <Typography variant="h4" style={{ fontWeight: 'bold', color: '#FFD700' }}>
                    OPEN PARKING MAP
                </Typography>
            </div>

            <Container maxWidth="sm">
                <Paper elevation={6} style={{ padding: '2.5rem', backgroundColor: '#1a1a1a', borderRadius: '1rem' }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#FFD700' }
                            }}
                            InputProps={{
                                style: {
                                    color: '#FFD700',
                                    borderColor: '#FFD700'
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#FFD700'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FFD700'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FFD700'
                                    }
                                }
                            }}
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputLabelProps={{
                                style: { color: '#FFD700' }
                            }}
                            InputProps={{
                                style: {
                                    color: '#FFD700'
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#FFD700'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FFD700'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FFD700'
                                    }
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{
                                marginTop: '1.5rem',
                                backgroundColor: '#FFD700',
                                color: '#000',
                                fontWeight: 'bold'
                            }}
                        >
                            Entrar
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
}

export default AdminLogin;

