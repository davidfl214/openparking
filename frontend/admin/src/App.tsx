import { DataContext } from "./context/DataContext.ts";
import GlobalRouter from "./routes/GlobalRouter.tsx";

function App() {
    const isMobile = window.innerWidth <= 640;

    return (
        <DataContext.Provider value={{ isMobile }}>
            <GlobalRouter />
        </DataContext.Provider>
    );
}

export default App;
