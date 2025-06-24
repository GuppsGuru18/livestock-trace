import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Livestocktraceability from './livestocktraceability';
import RecordPage from './RecordPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Livestocktraceability />} />
        <Route path="/record" element={<RecordPage />} />
      </Routes>
    </Router>
  );
}
export default App;