// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import HomeMap from './pages/HomeMap';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/home" element={<HomeMap />} />
                {/* Rutas no encontradas */}
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
