import React, { useState } from 'react';
import { StepFlowCard, HealthDecisionCard } from '../components/ui/NewUIComponents';
import { StatusBadge, InfoBanner } from '../components/ui/UIComponents';
import { workers } from '../data/dummyData';

const CheckOut = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const steps = ['Verify Worker (Inside Only)', 'Biometric Exit Scan', 'View Exit Condition', 'Finalize Check-Out'];
  
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);
  const isInside = selectedWorker?.status === 'Inside';
  const isEnrolled = selectedWorker?.fingerprintStatus === 'Enrolled';

  const handleSelectWorker = (e) => {
    setSelectedWorkerId(e.target.value);
    if (e.target.value) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
      setIsVerified(false);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      setCurrentStep(2);
    }, 2000);
  };

  const vitals = [
    { label: 'End HR (bpm)', value: '86' },
    { label: 'End SpO2 (%)', value: '97' }
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>Worker Check-Out Workflow</h1>
      
      <StepFlowCard steps={steps} currentStep={currentStep} />
      
      <InfoBanner message="Only workers currently inside the mine can be checked out." type="info" />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.5fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 1: Selection
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Select Worker (Currently Inside)</label>
              <select value={selectedWorkerId} onChange={handleSelectWorker}>
                <option value="">-- Choose Worker --</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id} disabled={w.status !== 'Inside'}>
                    {w.id} - {w.name} (INSIDE MINE)
                  </option>
                ))}
              </select>
            </div>

            {selectedWorker && (
              <div style={{ padding: '1rem', background: 'rgba(245, 179, 1, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Shift Duration:</span>
                   <span style={{ fontWeight: '600' }}>6h 15m</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
                   <StatusBadge status="INSIDE MINE" />
                </div>
              </div>
            )}
          </div>

          <div className={`card ${currentStep < 1 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 1 ? 0.4 : 1, pointerEvents: currentStep < 1 ? 'none' : 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 2: Biometric Exit Scan
            </h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100px', 
                height: '130px', 
                background: '#333', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{ fontSize: '3rem', opacity: isVerified ? 1 : 0.4 }}>👇</span>
                {isScanning && (
                  <div style={{ 
                      position: 'absolute', 
                      top: '0', 
                      left: '0',
                      width: '100%', 
                      height: '2px', 
                      background: 'var(--accent-primary)',
                      boxShadow: '0 0 10px var(--accent-primary)',
                      animation: 'scan-shorter-anim 1.5s infinite ease-in-out'
                  }}></div>
                )}
              </div>
              <button 
                className="btn btn-outline" 
                style={{ marginTop: '1.5rem', width: '100%' }} 
                onClick={handleScan}
                disabled={!isEnrolled || isScanning || isVerified}
              >
                {isScanning ? 'VERIFYING...' : (isVerified ? 'VERIFIED ✓' : 'SCAN THUMB AT EXIT')}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={`card ${currentStep < 2 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 2 ? 0.4 : 1, pointerEvents: currentStep < 2 ? 'none' : 'auto', flex: 1 }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 3: Post-Shift Health Condition
            </h3>
            {isVerified && (
              <HealthDecisionCard 
                decision={selectedWorker?.healthEligibility === 'Critical' ? 'EMERGENCY ATTENTION' : 'SAFE EXIT'} 
                vitals={vitals} 
              />
            )}
            {!isVerified && (
               <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                 Verification required to display health report.
               </div>
            )}
          </div>

          <div className={`card ${currentStep < 2 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 2 ? 0.4 : 1, pointerEvents: currentStep < 2 ? 'none' : 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 4: Finalize
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '1rem' }} 
                disabled={currentStep < 2}
                onClick={() => {setCurrentStep(3); alert('Check-out Optimized!');}}
              >
                CONFIRM CHECK-OUT
              </button>
              <button className="btn btn-danger" style={{ flex: 0.5, padding: '1rem' }} disabled={currentStep < 2}>
                EMERGENCY ALERT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
