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
