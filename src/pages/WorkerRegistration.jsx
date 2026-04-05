import React, { useState } from 'react';
import { TableCard, StatusBadge } from '../components/ui/UIComponents';
import { workers, departments, zones } from '../data/dummyData';

const WorkerRegistration = () => {
  const [enrollmentStatus, setEnrollmentStatus] = useState('Not Registered');
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setEnrollmentStatus('Enrolled Successfully');
    }, 3000);
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>New Worker Registration</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Registration Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📋 Registration Form
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Enter worker demographic data. Shift will be assigned by the supervisor during daily attendance.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Worker Code / ID</label>
              <input type="text" placeholder="e.g. W501" />
            </div>
            <div>
              <label>Full Name</label>
              <input type="text" placeholder="Enter Full Name" />
            </div>
            <div>
              <label>Age</label>
              <input type="number" placeholder="Enter Age" />
            </div>
            <div>
              <label>Phone Number</label>
              <input type="tel" placeholder="Enter Phone" />
            </div>
            <div>
              <label>Department</label>
              <select>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label>Zone / Mine Area</label>
              <select>
                {zones.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
            {/* SHIFT REMOVED PER REQUEST */}
            <div>
              <label>Emergency Contact</label>
              <input type="tel" placeholder="Enter Emergency Phone" />
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Health Baseline</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div>
                <label>Normal Temp (°F)</label>
                <input type="text" defaultValue="98.6" />
              </div>
              <div>
                <label>Normal HR (bpm)</label>
                <input type="text" defaultValue="72" />
              </div>
              <div>
                <label>Normal SpO2 (%)</label>
                <input type="text" defaultValue="99" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }}>REGISTER WORKER</button>
            <button className="btn btn-outline" style={{ flex: 0.5 }}>CLEAR FORM</button>
          </div>
        </div>

        {/* Biometric Enrollment Section */}
        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>👆 Fingerprint Enrollment</h3>
            <div style={{ 
              width: '180px', 
              height: '220px', 
              background: '#252525', 
              border: '2px dashed var(--border-color)', 
              borderRadius: '20px', 
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '5rem', opacity: isScanning ? 0.3 : 1, transition: '0.3s' }}>
                ✋
              </div>
              {isScanning && <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '4px', background: 'var(--accent-primary)', boxShadow: '0 0 15px var(--accent-primary)', animation: 'scan-anim 2s infinite ease-in-out' }}></div>}
            </div>
            <div style={{ marginTop: '1.5rem' }}><StatusBadge status={enrollmentStatus} /></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <button className="btn btn-outline" style={{ width: '100%' }} onClick={startScanning} disabled={isScanning}>{isScanning ? 'SCANNING...' : 'START ENROLLMENT'}</button>
             <button className="btn btn-primary" style={{ width: '100%' }} disabled={enrollmentStatus === 'Not Registered'}>SAVE FINGERPRINT TEMPLATE</button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'left' }}>Note: Worker must be enrolled before check-in/check-out. Fingerprint is required for daily shift assignment.</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <TableCard title="Recently Registered Workers">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Dept</th>
                <th>Biometric Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.slice(0, 4).map(w => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 600 }}>{w.id}</td>
                  <td>{w.name}</td>
                  <td>{w.department}</td>
                  <td><StatusBadge status={w.fingerprintStatus} /></td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>Waiting for Shift Assignment</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  );
};

export default WorkerRegistration;
