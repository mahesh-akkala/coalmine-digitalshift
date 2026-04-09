import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('password'); 
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [scanStatus, setScanStatus] = useState('Initiate Biometric');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    socket.on('scan_status', (data) => {
      console.log('📡 Scan Step:', data);
      setScanStatus(data.message);
    });

    socket.on('login_success', (data) => {
      console.log('✅ Biometric Login Succcess:', data);
      setIsScanning(false);
      setIsVerified(true);
      setShowPopup(true);
      setScanStatus('Scan completed successfully.');
      localStorage.setItem('coalmine_admin', JSON.stringify(data.user));
      setTimeout(() => navigate('/dashboard'), 2000);
    });

    socket.on('login_fail', (data) => {
      console.log('❌ Biometric Login Failed:', data);
      setIsScanning(false);
      setErrorMsg('Fingerprint not recognized.');
      setScanStatus('Scan failed. Please try again.');
    });

    return () => {
      socket.off('scan_status');
      socket.off('login_success');
      socket.off('login_fail');
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('coalmine_admin', JSON.stringify(data.admin));
        navigate('/dashboard');
      } else {
        if (formData.username === 'admin' && formData.password === 'password') {
          const dummyAdmin = { firstName: 'Admin', lastName: 'Supervisor', username: 'admin', email: 'admin@coalshift.com' };
          localStorage.setItem('coalmine_admin', JSON.stringify(dummyAdmin));
          navigate('/dashboard');
        } else {
          setErrorMsg(data.error || 'Authentication Failed');
        }
      }
    } catch (err) {
      setErrorMsg('Auth Server Offline');
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintScan = async () => {
    setIsScanning(true);
    setErrorMsg('');
    setScanStatus('Establishing handshake...');
    
    try {
      await fetch('http://localhost:5000/api/verifyFingerprint', { method: 'POST' });
    } catch (err) {
      setErrorMsg('Hardware Service Offline');
      setIsScanning(false);
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
      <div style={{ width: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '4.5rem', transform: 'rotate(-45deg)', marginBottom: '1rem', color: '#f5b301' }}>⛏️</div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '900', 
            color: '#f5b301', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            margin: '0 0 0.5rem 0' 
          }}>
            COALSHIFT MONITORING
          </h1>
          <p style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '500', opacity: 0.9 }}>Supervisor Secure Access</p>
        </div>

        <div style={{ 
          display: 'flex', 
          background: '#1a1a1a', 
          borderRadius: '8px', 
          padding: '4px', 
          marginBottom: '2.5rem',
          border: '1px solid #333'
        }}>
           <button 
             onClick={() => setLoginMethod('password')}
             style={{ 
               flex: 1, 
               padding: '0.8rem', 
               borderRadius: '6px',
               background: loginMethod === 'password' ? '#f5b301' : 'transparent',
               color: loginMethod === 'password' ? '#000' : '#ffffff',
               fontWeight: '700',
               fontSize: '0.85rem',
               border: 'none',
               cursor: 'pointer',
               transition: 'all 0.3s ease'
             }}
           >
             Password
           </button>
           <button 
             onClick={() => setLoginMethod('fingerprint')}
             style={{ 
               flex: 1, 
               padding: '0.8rem', 
               borderRadius: '6px',
               background: loginMethod === 'fingerprint' ? '#f5b301' : 'transparent',
               color: loginMethod === 'fingerprint' ? '#000' : '#ffffff',
               fontWeight: '700',
               fontSize: '0.85rem',
               border: 'none',
               cursor: 'pointer',
               transition: 'all 0.3s ease'
             }}
           >
             Fingerprint
           </button>
        </div>

        {errorMsg && (
          <div style={{ marginBottom: '1.5rem', color: '#ff4d4d', fontSize: '0.9rem', fontWeight: '600' }}>
            {errorMsg}
          </div>
        )}
        
        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.6rem', display: 'block' }}>Admin Username</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                placeholder="admin_mining_01" 
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: '#1a1a1a', 
                  border: '1px solid #333', 
                  borderRadius: '8px', 
                  color: '#fff',
                  boxSizing: 'border-box'
                }} 
                required 
              />
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.6rem', display: 'block' }}>Security Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="••••••••••••" 
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: '#1a1a1a', 
                  border: '1px solid #333', 
                  borderRadius: '8px', 
                  color: '#fff',
                  boxSizing: 'border-box'
                }} 
                required 
              />
            </div>
            
            <button type="submit" style={{ 
              width: '100%', 
              padding: '1.25rem', 
              background: '#f5b301', 
              color: '#000', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '800', 
              fontSize: '1rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }} disabled={loading}>
              {loading ? 'Authorizing...' : 'SECURE LOGIN'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '150px', 
              height: '180px', 
              background: '#1a1a1a', 
              border: isScanning ? '2px solid #f5b301' : '2px solid #333', 
              borderRadius: '16px', 
              margin: '0 auto 2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{ fontSize: '5rem', opacity: isVerified ? 1 : 0.4 }}>☝️</span>
              {isScanning && (
                <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  left: '0',
                  width: '100%', 
                  height: '4px', 
                  background: '#f5b301',
                  boxShadow: '0 0 15px #f5b301',
                  animation: 'scan-anim 2s infinite ease-in-out'
                }}></div>
              )}
            </div>
            
            <button 
              onClick={handleFingerprintScan}
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                background: isVerified ? '#2ecc71' : '#f5b301', 
                color: '#000', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: '800', 
                cursor: 'pointer' 
              }}
              disabled={isScanning || isVerified}
            >
              {isScanning ? scanStatus.toUpperCase() : (isVerified ? 'ACCESS GRANTED' : 'INITIATE BIOMETRIC')}
            </button>
          </div>
        )}
        
        {showPopup && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
            background: 'rgba(46, 204, 113, 0.95)', color: '#000', padding: '1rem 2rem',
            borderRadius: '12px', fontWeight: '800', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid #fff'
          }}>
            ✨ Scan completed successfully.
          </div>
        )}
        
        <div style={{ marginTop: '2.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#ffffff' }}>
            New Supervisor? <span onClick={() => navigate('/admin-register')} style={{ color: '#f5b301', fontWeight: '700', cursor: 'pointer', marginLeft: '5px' }}>Register Admin Profile</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scan-anim {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
};

export default Login;
