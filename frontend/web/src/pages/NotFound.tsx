import { LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="bg-primary min-h-screen w-full flex flex-col items-center justify-center text-center gap-4">
            <div className="flex items-center">
                <LocationOn className="text-secondary" sx={{ fontSize: 50 }} />
                <h1 className="text-white text-4xl font-bold mb-2 laptop:text-4xl">
                    OpenParking
                </h1>
            </div>
            <h1 className="text-white w-[75%] text-xl">Oops! No hemos encontrado la página que buscas.</h1>
            <Link to="/" className="text-white underline">
                Volver a la página principal
            </Link>
        </div>
    );
}
