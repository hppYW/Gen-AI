import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScenarioListPage from './pages/ScenarioListPage';
import NegotiationPagePhaser from './pages/NegotiationPagePhaser';
import NegotiationGuidePage from './pages/NegotiationGuidePage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scenarios" element={<ScenarioListPage />} />
          <Route path="/guide" element={<NegotiationGuidePage />} />
          <Route path="/negotiate/:scenarioId" element={<NegotiationPagePhaser />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
