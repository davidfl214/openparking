import type { JSX } from "react";
import Navbar from "../components/Navbar";
import Map from "../components/Map";

export default function Landing(): JSX.Element {

    return (
        <>
            <Navbar />
            <Map />
        </>
    );
}
