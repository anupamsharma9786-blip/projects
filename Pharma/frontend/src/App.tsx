import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadVcf from './pages/UploadVcf';
import ProcessingStatus from './pages/ProcessingStatus';
import ResultsDashboard from './pages/ResultsDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<UploadVcf />} />
          <Route path="/processing/:uploadId" element={<ProcessingStatus />} />
          <Route path="/results/:uploadId" element={<ResultsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
