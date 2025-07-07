import React from "react";

interface DataContextType {
    isMobile: boolean;
}

export const DataContext = React.createContext<DataContextType>({
    isMobile: window.innerWidth <= 640,
});