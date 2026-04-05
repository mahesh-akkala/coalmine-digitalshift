import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const adminData = localStorage.getItem('coalmine_admin');
  const admin = adminData ? JSON.parse(adminData) : { firstName: 'Admin', lastName: 'Supervisor', username: 'admin' };

  const getInitials = () => {
    return `${admin.firstName.charAt(0)}${admin.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <span className="current-date">{new Date().toDateString()}</span>
        </div>
        <div className="navbar-right">
          <div className="notification-icon">🔔 <span className="count">3</span></div>
          <div 
            className="admin-profile" 
            onClick={() => navigate('/settings')} 
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar" style={{ background: 'var(--accent-primary)', color: '#000', fontWeight: '800' }}>
              {getInitials()}
            </div>
            <div className="admin-info">
              <span className="admin-name">{admin.firstName} {admin.lastName}</span>
              <span className="admin-role">Shift Head</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
