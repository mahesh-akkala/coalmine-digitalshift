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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScanPopup, setShowScanPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scanInstruction, setScanInstruction] = useState('Initialize Enrollment');
  const [assignedSlot, setAssignedSlot] = useState(null);
  const [hasError, setHasError] = useState(false);
  
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
      setShowScanPopup(true);
      setTimeout(() => setShowScanPopup(false), 3000);
    });

    socket.on('scan_status', (data) => {
      console.log('📡 Scan Step:', data);
      
      const statusMap = {
        'WAITING': 'Waiting for finger...',
        'DETECTED': 'Finger detected ✅',
        'REMOVE': 'Remove finger',
        'PLACE_AGAIN': 'Place same finger again',
        'PROCESSING': 'Scanning...',
        'SUCCESS': 'Completed',
        'FAIL_MISMATCH': 'Finger mismatch ❌ Please try again',
        'FAIL_SCAN': 'Scan failed. Try again'
      };

      const msg = statusMap[data.status] || data.message;
      setEnrollmentStatus(msg);
      setScanInstruction(msg);

      if (data.status === 'SUCCESS') {
        setShowScanPopup(true);
        setTimeout(() => setShowScanPopup(false), 4000);
      }

      // AUTO-RETRY LOGIC: If scan fails, re-trigger command after 2 seconds
      if (data.status && data.status.startsWith('FAIL_')) {
        console.log('🔄 Failure detected. Auto-retrying enrollment...');
        setHasError(true);
        setIsScanning(false); // Stop the "scanning" state to enable the Try Again button
        setTimeout(() => {
          // Keep auto-retry if slot exists
          // if (assignedSlot) triggerEnrollment(assignedSlot); 
        }, 1500);
      }
    });

    socket.on('hardware_enrollment_error', (data) => {
      console.log('📡 Hardware Enrollment Error:', data);
      setIsScanning(false);
      setHasError(true);
      if (data.message === 'DUPLICATE_FINGER') {
        setErrorMessage('This finger is already registered to another worker!');
        setEnrollmentStatus('Duplicate Detected');
      } else if (data.message === 'MISMATCH') {
        setErrorMessage('Fingerprints did not match. Please try again.');
        setEnrollmentStatus('Scan Mismatch');
      }
      setTimeout(() => setErrorMessage(''), 5000);
    });

    return () => {
      socket.off('hardware_enrollment_success');
      socket.off('hardware_enrollment_error');
      socket.off('scan_status');
    };
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
    // 1. Uniqueness check for Enroll Number
    const isDuplicate = dbWorkers.some(w => w.fingerprintId && w.fingerprintId.toString() === formData.fingerprintId.toString());
    if (isDuplicate) {
      setErrorMessage(`CRITICAL: Enroll Number #${formData.fingerprintId} is already assigned to another operative!`);
      setTimeout(() => setErrorMessage(''), 6000);
      return;
    }

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
        setShowSuccessModal(true);
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

  const triggerEnrollment = async (slotId) => {
    try {
      await fetch('http://localhost:5000/api/device/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'ENROLL', slot: slotId })
      });
      console.log('📡 ENROLL Command sent for slot:', slotId);
    } catch (err) {
      console.error('Failed to trigger remote hardware', err);
    }
  };

  const startScanning = async () => {
    setIsScanning(true);
    setHasError(false);
    setEnrollmentStatus('Waiting for Physical Hardware Scan...');

    // Calculate next available BIO template ID
    const nextId = assignedSlot || (dbWorkers.length > 0 
      ? Math.max(...dbWorkers.map(w => parseInt(w.fingerprintId) || 0)) + 1 
      : 1);

    setAssignedSlot(nextId);
    triggerEnrollment(nextId);
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
      {errorMessage && <InfoBanner message={errorMessage} type="danger" />}

      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card glass animate-scale-in" style={{
            maxWidth: '400px', textAlign: 'center', padding: '3rem',
            border: '2px solid var(--success)', boxShadow: '0 0 50px rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✅</div>
            <h2 style={{ color: 'var(--success)', fontSize: '2rem', fontWeight: '900' }}>REGISTRATION SUCCESSFUL</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '1.5rem 0' }}>The worker has been authorized and added to the official coal mine registry.</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowSuccessModal(false)}>CONTINUE</button>
          </div>
        </div>
      )}

      {showScanPopup && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
          background: 'rgba(16, 185, 129, 0.95)', color: '#000', padding: '1rem 2rem',
          borderRadius: '12px', fontWeight: '800', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          animation: 'slide-in 0.5s ease-out', border: '1px solid #fff'
        }}>
           ✨ Fingerprint registered successfully ✅
        </div>
      )}

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
                  background: 'rgba(255,165,0,0.05)', 
                  border: '2px solid rgba(255,165,0,0.2)', 
                  borderRadius: '16px',
                  display: 'inline-block',
                  minWidth: '220px',
                  boxShadow: formData.fingerprintId ? '0 0 20px rgba(255,165,0,0.1)' : 'none'
              }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'block' }}>
                  🆔 ENROLL NUMBER
                </label>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
                  {formData.fingerprintId ? `#${formData.fingerprintId}` : '--'}
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.25rem', fontWeight: '600' }}>
                Hardware Slot Registry
              </p>
            </div>

            <StatusBadge status={enrollmentStatus} />
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem', background: isScanning ? 'var(--accent-primary)' : (hasError ? 'var(--danger)' : '') }} 
              onClick={startScanning} 
              disabled={isScanning || (!!formData.fingerprintId && !hasError)}
            >
              {isScanning ? scanInstruction.toUpperCase() : (hasError ? 'TRY AGAIN 🔄' : (formData.fingerprintId ? 'SLOT RESERVED ✓' : 'INITIALIZE ENROLLMENT'))}
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
