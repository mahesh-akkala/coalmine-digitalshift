import React, { useState } from 'react';
import { StepFlowCard, HealthDecisionCard } from '../components/ui/NewUIComponents';
import { StatusBadge, InfoBanner } from '../components/ui/UIComponents';
import { workers } from '../data/dummyData';

const CheckIn = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const steps = ['Select Registered Worker', 'Scan Fingerprint', 'View Health Condition', 'Approve or Reject Entry'];
  
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);
  const isOutside = selectedWorker?.status === 'Outside';
  const isEnrolled = selectedWorker?.fingerprintStatus === 'Enrolled';
  const isHealthy = selectedWorker?.healthEligibility === 'Safe';

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

  const handleClear = () => {
     setSelectedWorkerId('');
     setCurrentStep(0);
     setIsVerified(false);
  };

  const vitals = [
    { label: 'Temp (°F)', value: '98.5' },
    { label: 'HR (bpm)', value: '72' },
    { label: 'SpO2 (%)', value: '98' }
  ];

  const getHealthDecision = () => {
     if (selectedWorker?.healthEligibility === 'Blocked' || selectedWorker?.healthEligibility === 'Critical') {
        return 'NOT ALLOWED';
     }
     if (selectedWorker?.healthEligibility === 'Warning') {
        return 'WARNING';
     }
     return 'SAFE TO ENTER';
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>Worker Check-In Workflow</h1>
      
      <StepFlowCard steps={steps} currentStep={currentStep} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.5fr', gap: '2rem' }}>
        {/* Step 1 & 2: Selection & Biometrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 1: Selection
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Select Registered Worker (Outside Only)</label>
              <select value={selectedWorkerId} onChange={handleSelectWorker}>
                <option value="">-- Choose Worker --</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id} disabled={w.status === 'Inside'}>
                    {w.id} - {w.name} ({w.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedWorker && (
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: `1px solid ${isEnrolled ? 'var(--border-color)' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fingerprint ID:</span>
                   <StatusBadge status={isEnrolled ? 'Enrolled' : 'Not Enrolled'} />
                </div>
                {!isEnrolled && <p style={{ fontSize: '0.7rem', color: 'var(--danger)', marginTop: '0.5rem' }}>Worker must be registered with fingerprint before check-in.</p>}
              </div>
            )}
          </div>

          <div className={`card ${currentStep < 1 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 1 ? 0.4 : 1, pointerEvents: currentStep < 1 ? 'none' : 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 2: Biometric Verification
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
                <span style={{ fontSize: '3rem', opacity: isVerified ? 1 : 0.4 }}>☝️</span>
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
                {isScanning ? 'VERIFYING...' : (isVerified ? 'VERIFIED ✓' : 'SCAN FINGERPRINT')}
              </button>
            </div>
            <style>{`
                @keyframes scan-shorter-anim {
                  0% { top: 0; }
                  50% { top: 100%; }
                  100% { top: 0; }
                }
            `}</style>
          </div>
        </div>

        {/* Step 3 & 4: Health & Approval */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={`card ${currentStep < 2 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 2 ? 0.4 : 1, pointerEvents: currentStep < 2 ? 'none' : 'auto', flex: 1 }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 3: View Health Condition
            </h3>
            {isVerified && (
              <HealthDecisionCard 
                decision={getHealthDecision()} 
                vitals={vitals} 
              />
            )}
            {!isVerified && (
               <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                 Verification required to display health vitals.
               </div>
            )}
          </div>

          <div className={`card ${currentStep < 2 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 2 ? 0.4 : 1, pointerEvents: currentStep < 2 ? 'none' : 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Step 4: Decision
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '1rem' }} 
                disabled={currentStep < 2 || !isHealthy}
                onClick={() => {setCurrentStep(3); alert('Check-in Approved!');}}
              >
                APPROVE CHECK-IN
              </button>
              <button 
                className="btn btn-danger" 
                style={{ flex: 0.5, padding: '1rem' }} 
                disabled={currentStep < 2}
                onClick={handleClear}
              >
                REJECT / CANCEL
              </button>
            </div>
            {!isHealthy && isVerified && (
                <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                  🚫 Entry Denied: Worker vitals are outside safe operating limits.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
