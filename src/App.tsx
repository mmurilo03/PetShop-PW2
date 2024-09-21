import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <div className="h-screen w-screen">
            <Navbar />
            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default App;
