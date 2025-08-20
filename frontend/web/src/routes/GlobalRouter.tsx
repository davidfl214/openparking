import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ParkingDetailsPage from "../pages/ParkingsDetails";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

export default function GlobalRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element= {<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/parkings/:id" element={<ParkingDetailsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}