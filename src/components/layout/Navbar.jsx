import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <span className="current-date">{new Date().toDateString()}</span>
        </div>
        <div className="navbar-right">
          <div className="notification-icon">🔔 <span className="count">3</span></div>
          <div className="admin-profile">
            <div className="avatar">AD</div>
            <div className="admin-info">
              <span className="admin-name">Admin Supervisor</span>
              <span className="admin-role">Shift Head</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
