import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/admins/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setErrorMsg(data.error || 'Registration failed. Username or Email may already exist.');
      }
    } catch (err) {
      setErrorMsg('Network error. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0f0f0f',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      overflow: 'hidden',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ width: '450px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', transform: 'rotate(-45deg)', marginBottom: '1rem', color: '#f5b301' }}>⛏️</div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '900', 
            color: '#f5b301', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            margin: '0 0 0.5rem 0' 
          }}>
            OPERATOR ONBOARDING
          </h1>
          <p style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '500', opacity: 0.9 }}>Initialize Supervisor Credentials</p>
        </div>
        
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(46, 204, 113, 0.05)', borderRadius: '12px', border: '1px solid #2ecc71' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#2ecc71', fontWeight: '900', marginBottom: '1rem' }}>AUTHORIZED</h2>
            <p style={{ color: '#ffffff', opacity: 0.8 }}>Supervisor profile created. Accessing secure terminal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            {errorMsg && (
                <div style={{ marginBottom: '1.5rem', color: '#ff4d4d', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>
                  ⚠️ {errorMsg}
                </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  placeholder="John" 
                  style={{ width: '100%', padding: '0.9rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  placeholder="Doe" 
                  style={{ width: '100%', padding: '0.9rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} 
                  required 
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Authorized Work Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="john.doe@coalshift.com" 
                style={{ width: '100%', padding: '0.9rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} 
                required 
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>System Username</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                placeholder="supervisor_01" 
                style={{ width: '100%', padding: '0.9rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} 
                required 
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Security Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="••••••••••••" 
                style={{ width: '100%', padding: '0.9rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} 
                required 
              />
            </div>

            <button type="submit" style={{ 
              width: '100%', 
              padding: '1.1rem', 
              background: '#f5b301', 
              color: '#000', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '800', 
              fontSize: '0.95rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }} disabled={loading}>
              {loading ? 'INITIALIZING...' : 'ENABLE SUPERVISOR ACCESS'}
            </button>
          </form>
        )}
        
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#ffffff' }}>
            Existing Operative? <span onClick={() => navigate('/')} style={{ color: '#f5b301', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Login to Terminal</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
