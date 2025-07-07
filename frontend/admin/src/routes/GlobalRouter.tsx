import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";

export default function GlobalRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
        </BrowserRouter>
    );
}
