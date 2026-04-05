import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: '📊' },
    { title: 'Admin Registration', path: '/admin-register', icon: '👨‍💼', showInAuth: true },
    { title: 'Admin Login', path: '/', icon: '🔑', showInAuth: true },
    { title: 'Worker Registration', path: '/worker-registration', icon: '👷' },
    { title: 'Worker Attendance', path: '/worker-attendance', icon: '🆔' },
    { title: 'Registered Workers', path: '/worker-records', icon: '📜' },
    { title: 'Health Analytics', path: '/health-analytics', icon: '📈' },
    { title: 'Reports', path: '/reports', icon: '📋' },
    { title: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  // Note: Only non-auth items show in main sidebar layout
  const filteredItems = menuItems.filter(item => !item.showInAuth);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⛏️</div>
        <span>CoalShift</span>
      </div>
      <ul className="sidebar-menu">
        {filteredItems.map((item, index) => (
          <li key={index}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="icon">{item.icon}</span>
              <span className="title">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <span>Coal Mine Portal v3.0</span>
      </div>
    </div>
  );
};

export default Sidebar;
