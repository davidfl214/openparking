import type { JSX } from "react";
import Navbar from "../components/home/Navbar";
import Map from "../components/home/Map";

export default function Landing(): JSX.Element {
    return (
        <>
            <Navbar />
            <Map />
        </>
    );
}
