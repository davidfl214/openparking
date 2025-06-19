import { useState } from 'react';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', {
                email,
                password,
                role: 'USER' // o 'ADMIN'
            });
            alert("Registro exitoso");
        } catch (err) {
            alert("Error: " + err.response.data);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Registro</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            <button type="submit">Registrarse</button>
        </form>
    );
}

export default Register;
