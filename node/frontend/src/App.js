// Main App component
// TODO: This needs better organization

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components - notice the inconsistent imports
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Characters from './pages/Characters';
import Episodes from './pages/Episodes';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
