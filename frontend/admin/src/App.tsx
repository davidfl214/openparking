import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/AdminLogin";
/*
import AdminDashboard from "./pages/AdminDashboard";
*/
import AdminLoginPrueba from "./pages/AdminLoginPrueba.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-home" element={<AdminLoginPrueba />} />

                {/* Rutas no encontradas */}
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
