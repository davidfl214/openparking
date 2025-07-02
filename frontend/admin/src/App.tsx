import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/AdminLogin";
import React from "react";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-home" element={<AdminDashboard />} />

                {/* Rutas no encontradas */}
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
