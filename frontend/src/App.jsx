import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Participants from "./pages/Participants";
import Contributions from "./pages/Contributions";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function Nav() {
    return (
        <nav>
            <Link to="/">
                Ganpati Management{" "}
                <span
                    style={{
                        backgroundColor: "#FFD700",
                        color: "#8B0000",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontWeight: "bold",
                    }}
                >
                    Jay Bhagvan Group, Wamannagar
                </span>
            </Link>

            <span>
                <Link to="/register">Register</Link>
                <Link to="/participants">Participants</Link>
                <Link to="/contributions">Contributions</Link>
                <Link to="/expenses">Expenses</Link>
                <Link to="/login">Admin Login</Link>
            </span>
        </nav>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Nav />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/participants" element={<Participants />} />
                    <Route path="/contributions" element={<Contributions />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;