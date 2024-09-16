import { useState } from "react";
import "./App.css";
import Location from "./components/Location";
import CameraComponent from "./components/Camera";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <div>
      <h1 id="tableLabel">People + Pollinators</h1>

    <Router>
        <nav>
            <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/report">Report</Link>
                </li>
            </ul>
        </nav>
        <Routes>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/report" element={
                <Form />
            } />
        </Routes>
    </Router>
        </div>
  );
}

export default App;
