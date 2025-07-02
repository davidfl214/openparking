// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../web/src/pages/Login.jsx';
import Register from '../web/src/pages/Register.jsx';
import AdminLogin from './pages/AdminLogin';
import HomeMap from './pages/HomeMap';
import UserHome from "./pages/UserHome.jsx";
import AdminDashboard from "../admin/src/pages/AdminDashboard.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/home" element={<HomeMap />} />
                <Route path="/user-home" element={<UserHome />} />
                <Route path="/admin-home" element={<AdminDashboard />} />

                {/* Rutas no encontradas */}
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
