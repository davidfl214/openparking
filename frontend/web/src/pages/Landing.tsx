import type { JSX } from "react";
import Map from "../components/Map";
import Navbar from "../components/Navbar";

export default function Landing(): JSX.Element {
    return (
        <>
        <Navbar />
        <Map />
        </>
    );
}