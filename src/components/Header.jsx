import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{backgroundColor: '#025246', padding: '10px'}}>
      <h2 style={{color: 'white', textAlign: 'center'}}>AI Fitness Trainer</h2>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/tutorials">Tutorials</Link></li>
          <li><Link to="/yoga">Yoga</Link></li>
          <li><Link to="/train">Train</Link></li>
          <li><Link to="/nutrition">Nutrition</Link></li>
          <li><Link to="/chatbot">Chatbot</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;