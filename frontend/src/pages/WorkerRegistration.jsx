import React, { useState, useEffect } from 'react';
import { TableCard, StatusBadge, InfoBanner } from '../components/ui/UIComponents';
import { departments, zones } from '../data/dummyData';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const WorkerRegistration = () => {
  const [enrollmentStatus, setEnrollmentStatus] = useState('Not Registered');
  const [isScanning, setIsScanning] = useState(false);
  const [dbWorkers, setDbWorkers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    id: '', 
    name: '', 
    age: '', 
    phone: '', 
    department: departments[0], 
    zone: zones[0], 
    emergencyContact: '',
    fingerprintId: '', // Now manual entry
    normalHr: '72', 
    normalSpo2: '99'
  });

  useEffect(() => {
    fetchWorkers();

    socket.on('hardware_enrollment_success', (data) => {
      console.log('📡 Hardware Enrollment Event:', data);
      setFormData(prev => ({ ...prev, fingerprintId: data.fingerprintId.toString() }));
      setIsScanning(false);
      setEnrollmentStatus('Ready to Register');
    });

    return () => socket.off('hardware_enrollment_success');
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers');
      const data = await res.json();
      setDbWorkers(data);
    } catch (err) {
      console.error('Failed to fetch workers:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerWorker = async () => {
    if (!formData.id || !formData.name || !formData.fingerprintId) {
      return alert('Worker ID, Name, and Fingerprint ID are mandatory!');
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccessMessage(`Worker ${formData.name} registered successfully!`);
        fetchWorkers();
        setEnrollmentStatus('Enrolled Successfully');
        setTimeout(() => setSuccessMessage(''), 5000);
        // Reset form except defaults
        setFormData({
          id: '', name: '', age: '', phone: '', 
          department: departments[0], zone: zones[0], 
          emergencyContact: '', fingerprintId: '',
          normalHr: '72', normalSpo2: '99'
        });
      } else {
        const errorData = await res.json();
        alert(`Registration failed: ${errorData.error}`);
      }
    } catch (err) {
      alert('Network error while saving worker to database');
    }
  };

  const startScanning = async () => {
    setIsScanning(true);
    setEnrollmentStatus('Waiting for Physical Hardware Scan...');

    // Calculate next available BIO template ID
    const nextId = dbWorkers.length > 0 
      ? Math.max(...dbWorkers.map(w => parseInt(w.fingerprintId) || 0)) + 1 
      : 1;

    // Command the ESP32 remotely!
    try {
      await fetch('http://localhost:5000/api/device/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'ENROLL', slot: nextId })
      });
    } catch (err) {
      console.error('Failed to trigger remote hardware', err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Worker Onboarding</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <StatusBadge status="System Online" />
        </div>
      </div>

      {successMessage && <InfoBanner message={successMessage} type="info" />}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem' }}>
        {/* Registration Form */}
        <div className="card glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📑</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Personal Information</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label>Worker Code / ID</label>
              <input type="text" name="id" value={formData.id} onChange={handleInputChange} placeholder="e.g. W501" />
            </div>
            <div>
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
            </div>
            <div>
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Enter Age" />
            </div>
            <div>
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXX..." />
            </div>
            <div>
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleInputChange}>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label>Assigned Zone</label>
              <select name="zone" value={formData.zone} onChange={handleInputChange}>
                {zones.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label>Emergency Contact</label>
              <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Emergency Phone" />
            </div>
          </div>
          
          <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🩺 Health Baseline
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label>Normal Pulse (BPM)</label>
                <input type="text" name="normalHr" value={formData.normalHr} onChange={handleInputChange} />
              </div>
              <div>
                <label>Normal Oxygen (%)</label>
                <input type="text" name="normalSpo2" value={formData.normalSpo2} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '3rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={registerWorker}>
              REGISTER IN SYSTEM
            </button>
            <button className="btn btn-outline" style={{ flex: 0.4 }} onClick={() => setFormData({ id: '', name: '', age: '', phone: '', department: departments[0], zone: zones[0], emergencyContact: '', fingerprintId: '', normalHr: '72', normalSpo2: '99' })}>
              RESET
            </button>
          </div>
        </div>

        {/* Biometric Enrollment Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="card glass" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>☝️</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Biometrics</h2>
            </div>

            <div style={{ 
              width: '160px', height: '200px', background: 'rgba(0,0,0,0.2)', 
              border: '2px dashed var(--border-color)', borderRadius: '24px', 
              margin: '0 auto 2rem', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', position: 'relative', overflow: 'hidden',
              boxShadow: isScanning ? '0 0 30px var(--accent-glow)' : 'none',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{ fontSize: '6rem', opacity: isScanning ? 0.2 : 0.6 }}>✋</div>
              {isScanning && (
                <div style={{ 
                  position: 'absolute', top: '0', left: '0', width: '100%', 
                  height: '4px', background: 'var(--accent-primary)', 
                  boxShadow: '0 0 15px var(--accent-primary)', 
                  animation: 'scan-anim 2s infinite ease-in-out' 
                }}></div>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '16px',
                  display: 'inline-block',
                  minWidth: '200px'
              }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
                  Auto-Assigned Bio Slot
                </label>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-primary)', letterSpacing: '-0.02em' }}>
                  {formData.fingerprintId ? `#${formData.fingerprintId}` : '--'}
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Securely synchronized with local device storage.
              </p>
            </div>

            <StatusBadge status={enrollmentStatus} />
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem' }} 
              onClick={startScanning} 
              disabled={isScanning || !!formData.fingerprintId}
            >
              {isScanning ? 'ESTABLISHING HANDSHAKE...' : (formData.fingerprintId ? 'SLOT RESERVED ✓' : 'INITIALIZE ENROLLMENT')}
            </button>
          </div>

          <div className="card glass animate-fade-in" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: '800' }}>Biometric Registry Info</h4>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
               The system automatically provisions a unique hardware slot ID for each operative to ensure conflict-free biometric matching across all nodes.
             </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <TableCard title="Database Overview">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Bio Template</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {dbWorkers.map(w => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{w.id}</td>
                  <td style={{ fontWeight: 500 }}>{w.name}</td>
                  <td>{w.department}</td>
                  <td><StatusBadge status={w.fingerprintId ? `Slot #${w.fingerprintId}` : 'No Bio'} /></td>
                  <td><StatusBadge status={w.status} /></td>
                </tr>
              ))}
              {dbWorkers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No workforce records found in MongoDB.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
};

export default WorkerRegistration;
