import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content" style={{ padding: '2rem 0' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
