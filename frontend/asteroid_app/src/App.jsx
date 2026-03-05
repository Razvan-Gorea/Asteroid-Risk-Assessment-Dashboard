import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Visualizations from "./pages/Visualizations";
import IndividualNeo from "./pages/IndividualNeo";
import NavigationBar from "./components/All/NavigationBar";

function App() {
  return (
    <Router>
      <div className="min-h-screen p-3 md:p-4" style={{ background: "#030810", position: "relative" }}>
        {/* Grid background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/individual-neo" element={<IndividualNeo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
