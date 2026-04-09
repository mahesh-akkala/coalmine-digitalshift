import React, { useState, useEffect } from 'react';
import { StatCard, StatusBadge, InfoBanner } from '../components/ui/UIComponents';
import { HealthDecisionCard } from '../components/ui/NewUIComponents';
import { EligibilityCard } from '../components/ui/EligibilityCard';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
const shifts = ['Morning (06:00-14:00)', 'Afternoon (14:00-22:00)', 'Night (22:00-06:00)'];

const WorkerAttendance = () => {
  const [workers, setWorkers] = useState([]);
  const [viewState, setViewState] = useState('SCAN'); 
  const [isScanning, setIsScanning] = useState(false);
  const [identifiedWorker, setIdentifiedWorker] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchWorkers();

    socket.on('new_scan', (data) => {
      console.log('📡 Attendance Scan:', data);
      setStatusMessage(null);
      setIdentifiedWorker(data.worker);
      setVitals([
        { label: 'Heart Rate', value: data.vitals.heartRate.toFixed(0) + ' bpm' },
        { label: 'Oxygen Level', value: data.vitals.spo2.toFixed(0) + '%' }
      ]);
      setViewState('RESULTS');
      setIsScanning(false);
    });

    socket.on('scan_error', (data) => {
      console.log('📡 Attendance Error:', data);
      setStatusMessage({ type: 'error', text: data.error });
      setIsScanning(false);
      setViewState('SCAN');
    });

    return () => {
      socket.off('new_scan');
      socket.off('scan_error');
    };
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers');
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setIdentifiedWorker(null);
    setStatusMessage({ type: 'info', text: 'Terminal active. Waiting for biometric handshake...' });
  };

  const getGuidance = (worker) => {
    const s = worker.healthEligibility.toLowerCase();
    if (s === 'safe') return 'SAFE';
    if (s === 'warning') return 'WARNING';
    return 'CRITICAL';
  };

  const handleManualAction = async (actionType) => {
    if (!identifiedWorker) return;
    
    try {
      const endpoint = actionType === 'allow_entry' ? 'check-in' : 'check-out';
      const res = await fetch(`http://localhost:5000/api/workers/${identifiedWorker.id}/${endpoint}`, {
        method: 'POST'
      });
      
      if (res.ok) {
        if (actionType === 'allow_entry') {
          setViewState('SUCCESS_ENTRY');
        } else if (actionType === 'allow_exit') {
          setViewState('TOMORROW_DECISION');
        } else if (actionType === 'reject_entry') {
          setViewState('SUCCESS_REJECT');
        }
        fetchWorkers();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Authentication server unreachable.' });
    }
  };

  const resetProcess = () => {
    setIdentifiedWorker(null);
    setViewState('SCAN');
    setSelectedShift(shifts[0]);
    setStatusMessage(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Terminal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: '500' }}>
            Multi-stage biometric validation and shift authorization.
          </p>
        </div>
      </div>

      {statusMessage && <InfoBanner message={statusMessage.text} type={statusMessage.type === 'error' ? 'danger' : 'info'} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard label="Underground Total" value={workers.filter(w => w.status === 'Inside').length.toString()} icon="⛏️" color="var(--success)" />
        <StatCard label="Surface Personnel" value={workers.filter(w => w.status === 'Outside').length.toString()} icon="🏠" color="var(--text-secondary)" />
        <StatCard label="Critical Alerts" value={workers.filter(w => w.healthEligibility === 'Critical').length.toString()} icon="🚨" color="var(--danger)" />
        <StatCard label="Warning Flags" value={workers.filter(w => w.healthEligibility === 'Warning').length.toString()} icon="⚠️" color="var(--warning)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem' }}>
        {/* Step 1: Biometric Verification */}
        <div className="card glass" style={{ textAlign: 'center', opacity: viewState !== 'SCAN' ? 0.4 : 1, transition: 'var(--transition)', border: viewState === 'SCAN' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            {viewState !== 'SCAN' ? (
              <span className="badge" style={{ background: 'var(--success)', color: '#000' }}>IDENTITY VERIFIED</span>
            ) : (
              <span className="badge" style={{ background: 'rgba(245, 179, 1, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}>STAGE 1: HARDWARE AUTH</span>
            )}
          </div>
          
          <div style={{ 
            width: '140px', height: '180px', background: 'rgba(0,0,0,0.2)', 
            border: viewState === 'SCAN' ? '2px dashed var(--accent-primary)' : '2px solid var(--border-color)', 
            borderRadius: '24px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <span style={{ fontSize: '5rem', opacity: isScanning ? 0.2 : 0.6 }}>☝️</span>
            {isScanning && (
              <div style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', 
                height: '4px', background: 'var(--accent-primary)', 
                boxShadow: '0 0 20px var(--accent-primary)', 
                animation: 'scan-anim 2s infinite ease-in-out' 
              }}></div>
            )}
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem' }} 
            onClick={startScan} 
            disabled={viewState !== 'SCAN' || isScanning}
          >
            {isScanning ? 'ESTABLISHING LINK...' : 'ENGAGE SCANNER'}
          </button>
        </div>

        {/* Dynamic Workflow Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Step 2: Identification Profile */}
          {identifiedWorker && (
            <div className="card glass animate-fade-in" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Active Operative Detected</h4>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>{identifiedWorker.name}</h2>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                       <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-primary)', fontWeight: '700' }}>{identifiedWorker.id}</code>
                       <StatusBadge status={identifiedWorker.status.toUpperCase()} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <label style={{ margin: 0, fontSize: '0.7rem' }}>Assigned Zone</label>
                     <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{identifiedWorker.zone}</div>
                  </div>
               </div>
            </div>
          )}

          {/* Step 3: Results & Decision */}
          {(viewState === 'RESULTS' || viewState.startsWith('SUCCESS') || viewState === 'TOMORROW_DECISION') && identifiedWorker && (
            <>
              <div className="animate-fade-in">
                <HealthDecisionCard 
                  decision={getGuidance(identifiedWorker)}
                  vitals={vitals}
                />
              </div>

              {viewState === 'RESULTS' && (
                <div className="card glass animate-fade-in" style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase' }}>Command Authorization</h3>
                  </div>
                  
                  {identifiedWorker.status === 'Outside' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div>
                        <label>Shift Assignment</label>
                        <select 
                          value={selectedShift} 
                          onChange={(e) => setSelectedShift(e.target.value)}
                        >
                          {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                        <button className="btn btn-primary" onClick={() => handleManualAction('allow_entry')}>GRANT ACCESS</button>
                        <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleManualAction('reject_entry')}>DENY ENTRY</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => handleManualAction('allow_exit')}>AUTHORIZE SURFACE EXIT</button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Outcomes */}
          {viewState === 'SUCCESS_ENTRY' && (
            <div className="card glass animate-fade-in" style={{ textAlign: 'center', border: '2px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
               <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛡️</div>
               <h2 style={{ color: 'var(--success)', fontWeight: '900', fontSize: '2rem' }}>ENTRY AUTHORIZED</h2>
               <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.1rem' }}>Shift Sync: <span style={{ fontWeight: '800', color: '#fff' }}>{selectedShift}</span></p>
               <button className="btn btn-outline" style={{ marginTop: '2.5rem', width: '100%' }} onClick={resetProcess}>NEXT OPERATIVE</button>
            </div>
          )}

          {viewState === 'SUCCESS_REJECT' && (
            <div className="card glass animate-fade-in" style={{ textAlign: 'center', border: '2px solid var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
               <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⛔</div>
               <h2 style={{ color: 'var(--danger)', fontWeight: '900', fontSize: '2rem' }}>ACCESS RESTRICTED</h2>
               <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Medical parameters outside safe operating range.</p>
               <button className="btn btn-outline" style={{ marginTop: '2.5rem', width: '100%' }} onClick={resetProcess}>NEXT OPERATIVE</button>
            </div>
          )}

          {viewState === 'TOMORROW_DECISION' && identifiedWorker && (
             <EligibilityCard 
               guidance={identifiedWorker.healthEligibility.toLowerCase() === 'safe' ? 'FIT' : 'RECOVERY REQUIRED'} 
               onDecision={() => setViewState('SUCCESS_EXIT')} 
             />
          )}

          {viewState === 'SUCCESS_EXIT' && (
             <div className="card glass animate-fade-in" style={{ textAlign: 'center', border: '2px solid var(--info)', background: 'rgba(59, 130, 246, 0.05)' }}>
               <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏢</div>
               <h2 style={{ color: 'var(--info)', fontWeight: '900', fontSize: '2rem' }}>EXIT COMPLETE</h2>
               <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Operative has been logged out of the underground network.</p>
               <button className="btn btn-outline" style={{ marginTop: '2.5rem', width: '100%' }} onClick={resetProcess}>NEXT OPERATIVE</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerAttendance;
