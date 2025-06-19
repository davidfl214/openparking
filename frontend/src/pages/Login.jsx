import { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            if (res.data === 'USER') {
                alert("Inicio de sesión exitoso como usuario");
                window.location.href = '/home';
            } else {
                alert("No tienes permisos de usuario");
            }
        } catch (err) {
            const message = err.response?.data || "Error de conexión con el servidor";
            alert("Error: " + message);
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
