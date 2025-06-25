import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Visualizations from './pages/Visualizations';
import IndividualNeo from './pages/IndividualNeo';
import NavigationBar from './components/NavigationBar'

function App() {

  return (
  <Router>
      <div className="min-h-screen bg-blue-50 p-3">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visualizations" element={<Visualizations />} />
          <Route path="/individual-neo" element={<IndividualNeo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
