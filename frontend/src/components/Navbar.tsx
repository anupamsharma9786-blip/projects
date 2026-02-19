import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <h1>🧬 Pharmacogenomics Analysis</h1>
        <div>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
