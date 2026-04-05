import React, { useState, useEffect } from 'react';
import { StepFlowCard, HealthDecisionCard } from '../components/ui/NewUIComponents';
import { StatusBadge, InfoBanner } from '../components/ui/UIComponents';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const CheckIn = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [activeWorker, setActiveWorker] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [vitals, setVitals] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchWorkers();

    socket.on('new_scan', (data) => {
      console.log('📡 Real-time Scan Pulse:', data);
      
      // Match with the current selection or auto-detect
      setActiveWorker(data.worker);
      setSelectedWorkerId(data.worker.id);
      
      setVitals([
        { label: 'Pulse Rate', value: `${data.vitals.heartRate} BPM` },
        { label: 'Oxygen Saturation', value: `${data.vitals.spo2}%` }
      ]);
      
      setIsVerified(true);
      setCurrentStep(2);
      setIsScanning(false);
    });

    return () => socket.off('new_scan');
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers');
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error('Error fetching workers:', err);
    }
  };

  const steps = ['Biometric Readiness', 'Identity Verification', 'Health Assessment', 'Access Granted'];
  
  const selectedWorker = activeWorker || workers.find(w => w.id === selectedWorkerId);
  const isEnrolled = !!selectedWorker?.fingerprintId;
  const isHealthy = selectedWorker?.healthEligibility === 'Safe';

  const handleSelectWorker = (e) => {
    const id = e.target.value;
    setSelectedWorkerId(id);
    const worker = workers.find(w => w.id === id);
    setActiveWorker(worker);
    if (id) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
      setIsVerified(false);
      setVitals([]);
    }
  };

  const handleScanPoll = () => {
    setIsScanning(true);
    setCurrentStep(1);
    setStatusMessage({ type: 'info', text: 'Polling ESP32 sensors... Please place finger on scanner.' });
  };

  const handleProcessAction = async (actionType) => {
    if (!selectedWorker) return;
    
    try {
      const endpoint = actionType === 'check-in' ? 'check-in' : 'check-out';
      const res = await fetch(`http://localhost:5000/api/workers/${selectedWorker.id}/${endpoint}`, {
        method: 'POST'
      });
      
      if (res.ok) {
        const data = await res.json();
        setStatusMessage({ 
          type: 'success', 
          text: `${selectedWorker.name} has successfully ${actionType === 'check-in' ? 'entered the mine' : 'exited the mine'}.` 
        });
        setCurrentStep(3);
        fetchWorkers(); // Refresh list
        // Reset after delay
        setTimeout(handleClear, 4000);
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update access logs.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error during authorization.' });
    }
  };

  const handleClear = () => {
     setSelectedWorkerId('');
     setCurrentStep(0);
     setIsVerified(false);
     setActiveWorker(null);
     setVitals([]);
     setStatusMessage(null);
  };

  const getHealthDecision = () => {
     if (selectedWorker?.healthEligibility === 'Blocked' || selectedWorker?.healthEligibility === 'Critical') {
        return 'NOT ALLOWED';
     }
     if (selectedWorker?.healthEligibility === 'Warning') {
        return 'WARNING: EXERCISE CAUTION';
     }
     return 'SAFE TO ENTER';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Access Control Terminal</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <StatusBadge status={isScanning ? 'Scanning...' : 'Idle'} />
          <StatusBadge status="Node-01 Active" />
        </div>
      </div>
      
      <StepFlowCard steps={steps} currentStep={currentStep} />

      {statusMessage && <InfoBanner message={statusMessage.text} type={statusMessage.type === 'error' ? 'danger' : 'info'} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem' }}>
        {/* Step 1 & 2: Selection & Biometrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="card glass">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.2rem' }}>👤</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase' }}>Worker Identification</h3>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Manual Override Select</label>
              <select value={selectedWorkerId} onChange={handleSelectWorker} style={{ background: 'var(--bg-primary)' }}>
                <option value="">-- Waiting for Hardware Signal --</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.id} - {w.name} ({w.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedWorker && (
              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: `1px solid ${isEnrolled ? 'var(--border-color)' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Biometric Status:</span>
                   <StatusBadge status={isEnrolled ? `Slot #${selectedWorker.fingerprintId}` : 'Unregistered'} />
                </div>
                {!isEnrolled && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.75rem', fontWeight: '500' }}>⚠️ Biometric profile missing. Access denied until registered.</p>}
              </div>
            )}
          </div>

          <div className={`card glass ${currentStep < 1 && !isScanning ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 1 && !isScanning ? 0.4 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🧪</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase' }}>Biometric Verification</h3>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '120px', 
                height: '150px', 
                background: 'rgba(0,0,0,0.3)', 
                border: '2px solid var(--border-color)', 
                borderRadius: '20px', 
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isScanning ? '0 0 20px var(--accent-glow)' : 'none'
              }}>
                <span style={{ fontSize: '4rem', opacity: isVerified ? 1 : (isScanning ? 0.2 : 0.4), transition: '0.5s' }}>☝️</span>
                {isScanning && (
                  <div style={{ 
                      position: 'absolute', 
                      top: '0', 
                      left: '0',
                      width: '100%', 
                      height: '3px', 
                      background: 'var(--accent-primary)',
                      boxShadow: '0 0 15px var(--accent-primary)',
                      animation: 'scan-anim 2s infinite ease-in-out'
                  }}></div>
                )}
              </div>
              
              <button 
                className={`btn ${isVerified ? 'btn-primary' : 'btn-outline'}`} 
                style={{ marginTop: '2.5rem', width: '100%' }} 
                onClick={handleScanPoll}
                disabled={isScanning || isVerified}
              >
                {isScanning ? 'POLLING SENSORS...' : (isVerified ? 'MATCH FOUND ✓' : 'INITIALIZE BIO-SCAN')}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3 & 4: Health & Approval */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className={`card glass ${currentStep < 2 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 2 ? 0.3 : 1, transition: 'var(--transition)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🩺</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase' }}>Condition Monitoring</h3>
            </div>
            
            {isVerified && (
              <HealthDecisionCard 
                decision={getHealthDecision()} 
                vitals={vitals} 
              />
            )}
            
            {!isVerified && (
               <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                 {isScanning ? 'Hardware awaiting biometric contact...' : 'Identity verification required to initialize health assessment diagnostics.'}
               </div>
            )}
          </div>

          <div className={`card glass ${currentStep < 2 ? 'disabled-card' : ''}`} style={{ opacity: currentStep < 2 ? 0.3 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase' }}>Final Logic Decision</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {selectedWorker?.status === 'Inside' ? (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '1.2rem' }} 
                  onClick={() => handleProcessAction('check-out')}
                >
                  AUTHORIZE EXIT
                </button>
              ) : (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '1.2rem' }} 
                  disabled={currentStep < 2 || !isHealthy}
                  onClick={() => handleProcessAction('check-in')}
                >
                  AUTHORIZE ENTRY
                </button>
              )}
              
              <button 
                className="btn btn-danger" 
                style={{ flex: 0.6, padding: '1.2rem' }} 
                onClick={handleClear}
              >
                ABORT / RESET
              </button>
            </div>
            
            {!isHealthy && isVerified && (
                <div style={{ marginTop: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)' }}>
                  <p style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '700', textAlign: 'center' }}>
                    PROHIBITED: Worker vitals exceed regulatory safety parameters for active duty.
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
