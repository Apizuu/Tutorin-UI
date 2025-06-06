// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Assuming LandingPage is in src/pages
import CallbackPage from './pages/CallbackPage';
import DashboardPage from './pages/DashboardPage';
import SessionPage from './pages/SessionPage';
import TopUpPage from './pages/TopUpPage';  // Your new callback page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/Session" element={<SessionPage/>} />
        <Route path="/TopUp" element={<TopUpPage/>} />
        {/* Define the route for your callback URL */}
        <Route path="/callback" element={<CallbackPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;