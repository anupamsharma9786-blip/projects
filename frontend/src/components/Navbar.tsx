import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <h1>
          <span>💊</span>
          <span>Pharma<span style={{ color: '#00b47d' }}>Guard</span></span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '12px', opacity: 0.9, fontWeight: 500 }}>
            Pharmacogenomics Analysis Platform
          </span>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            📤 Upload VCF
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

