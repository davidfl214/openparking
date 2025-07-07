import Navbar from "../components/home/Navbar";
import Map from "../components/home/Map";
import type { JSX } from "react";

export default function Landing(): JSX.Element {

    return (
        <>
            <Navbar />
            <Map />
        </>
    );
}
