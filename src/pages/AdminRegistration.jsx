import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            New Admin Registration
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Mining Supervision Portal</p>
        </div>
        
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)' }}>
            <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Success!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Admin registered successfully. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label>First Name</label>
                <input type="text" placeholder="John" required />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label>Last Name</label>
                <input type="text" placeholder="Doe" required />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Work Email</label>
              <input type="email" placeholder="john.doe@mining.gov" required />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label>Choose Username</label>
              <input type="text" placeholder="admin_user_01" required />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} required />
              <label style={{ margin: 0, fontSize: '0.8rem' }}>I agree to the mining safety & data protocols</label>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
              REGISTER ADMIN
            </button>
          </form>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already registered? <a href="/" onClick={(e) => {e.preventDefault(); navigate('/');}} style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
