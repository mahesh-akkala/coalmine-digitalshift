import React, { useState } from 'react';
import { StatCard, StatusBadge } from '../components/ui/UIComponents';
import { HealthDecisionCard } from '../components/ui/NewUIComponents';
import { EligibilityCard } from '../components/ui/EligibilityCard';
import { stats, workers as initialWorkers, shifts } from '../data/dummyData';

const WorkerAttendance = () => {
  const [workers, setWorkers] = useState(initialWorkers);
  const [viewState, setViewState] = useState('SCAN'); 
  const [isScanning, setIsScanning] = useState(false);
  const [identifiedWorker, setIdentifiedWorker] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [selectedShift, setSelectedShift] = useState(shifts[0]);
  const [finalAssignedShift, setFinalAssignedShift] = useState('');
  
  const startScan = () => {
    setIsScanning(true);
    setIdentifiedWorker(null);
    setTimeout(() => {
      setIsScanning(false);
      const demoWorkers = [
        workers.find(w => w.id === 'W102'), 
        workers.find(w => w.id === 'W104'), 
        workers.find(w => w.id === 'W101'),
        workers.find(w => w.id === 'W103')
      ];
      const selected = demoWorkers[Math.floor(Math.random() * demoWorkers.length)];
      setIdentifiedWorker(selected);
      setViewState('IDENTIFIED');
    }, 2000);
  };

  const startHealthCheck = () => {
    setViewState('READING');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setReadingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setViewState('RESULTS'), 500);
      }
    }, 150);
  };

  const getGuidance = (worker) => {
    if (worker.healthEligibility === 'Safe') return worker.status === 'Outside' ? 'SAFE RANGE' : 'SAFE EXIT';
    if (worker.healthEligibility === 'Warning') return 'NEEDS ATTENTION';
    return worker.status === 'Outside' ? 'HIGH RISK' : 'EMERGENCY ATTENTION';
  };

  const handleManualAction = (actionType) => {
    if (actionType === 'allow_entry') {
      const updated = workers.map(w => w.id === identifiedWorker.id ? { ...w, status: 'Inside', shift: selectedShift } : w);
      setWorkers(updated);
      setFinalAssignedShift(selectedShift);
      setViewState('SUCCESS_ENTRY');
    } else if (actionType === 'reject_entry') {
      setViewState('SUCCESS_REJECT');
    } else if (actionType === 'allow_exit') {
      const updated = workers.map(w => w.id === identifiedWorker.id ? { ...w, status: 'Outside' } : w);
      setWorkers(updated);
      setViewState('TOMORROW_DECISION');
    }
  };

  const resetProcess = () => {
    setIdentifiedWorker(null);
    setViewState('SCAN');
    setReadingProgress(0);
    setSelectedShift(shifts[0]);
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Worker Attendance Verification</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Fingerprint first, then health checkup, then supervisor assigns shift and decision.</p>
      </div>

      <div style={{ display: grid, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <StatCard label="Workers Inside" value={stats.find(s => s.id === 2).value} icon="⛏️" color="var(--success)" />
        <StatCard label="Workers Outside" value={stats.find(s => s.id === 3).value} icon="🚪" color="var(--text-secondary)" />
        <StatCard label="Blocked / Rejected Today" value={stats.find(s => s.id === 4).value} icon="🚫" color="var(--danger)" />
        <StatCard label="Health Alerts" value={stats.find(s => s.id === 5).value} icon="⚠️" color="var(--warning)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 1.5fr', gap: '2.5rem' }}>
        {/* Step 1: Biometric Verification */}
        <div className="card" style={{ textAlign: 'center', opacity: viewState !== 'SCAN' ? 0.6 : 1, transition: 'all 0.3s', border: viewState === 'SCAN' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            {viewState !== 'SCAN' ? <span style={{ background: 'var(--success)', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>STEP 1 COMPLETED</span> : <span style={{ border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>STEP 1: VERIFICATION</span>}
          </div>
          <div style={{ 
            width: '120px', height: '160px', background: '#252525', 
            border: viewState === 'SCAN' ? '2px dashed var(--accent-primary)' : '2px solid var(--border-color)', 
            borderRadius: '20px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <span style={{ fontSize: '4.5rem', opacity: isScanning ? 0.3 : 1 }}>☝️</span>
            {isScanning && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'var(--accent-primary)', boxShadow: '0 0 15px var(--accent-primary)', animation: 'scan-move 1.5s infinite' }}></div>}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} onClick={startScan} disabled={viewState !== 'SCAN' || isScanning}>
            {isScanning ? 'VERIFYING...' : 'SCAN FINGERPRINT'}
          </button>
        </div>

        {/* Dynamic Workflow Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Step 2: Identification Profile */}
          {(viewState !== 'SCAN') && (
            <div className="card" style={{ animation: 'slide-up 0.4s ease-out' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Identification Profile</h4>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{identifiedWorker.name} ({identifiedWorker.id})</h2>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                       <StatusBadge status={identifiedWorker.status.toUpperCase() + ' MINE'} />
                       {viewState === 'IDENTIFIED' && <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 'bold', animation: 'blink 1.5s infinite' }}>Waiting for Health Checkup</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                     <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>Previous Shift: {identifiedWorker.previousShift}</div>
                     <div>Zone: {identifiedWorker.zone}</div>
                  </div>
               </div>

               {viewState === 'IDENTIFIED' && (
                 <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Worker verified. Previous shift records retrieved. Please proceed to sensor reading.</p>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: 'var(--info)', border: 'none', color: '#fff' }} onClick={startHealthCheck}>START HEALTH CHECKUP (READ SENSORS)</button>
                 </div>
               )}
            </div>
          )}

          {/* Step 3: Sensor Reading Simulation */}
          {viewState === 'READING' && (
            <div className="card" style={{ animation: 'slide-up 0.4s ease-out', textAlign: 'center', padding: '3rem' }}>
               <h3 style={{ marginBottom: '1rem', color: 'var(--info)' }}>STEP 3: SENSOR HEALTH READING</h3>
               <div style={{ width: '100%', height: '8px', background: '#252525', borderRadius: '10px', overflow: 'hidden', margin: '2rem 0' }}>
                  <div style={{ height: '100%', background: 'var(--info)', width: `${readingProgress}%`, transition: 'width 0.15s linear', boxShadow: '0 0 10px var(--info)' }}></div>
               </div>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>READING HEALTH DATA FROM SENSORS...</p>
               <div style={{ marginTop: '2rem' }}><span style={{ fontSize: '2.5rem', animation: 'pulse 1s infinite', display: 'inline-block' }}>🩺</span></div>
            </div>
          )}

          {/* Step 4: Results & Decision */}
          {(viewState === 'RESULTS' || viewState.startsWith('SUCCESS') || viewState === 'TOMORROW_DECISION') && (
            <>
              <div className="card" style={{ animation: 'slide-up 0.4s ease-out', borderLeft: '5px solid var(--accent-primary)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>STEP 4: FINAL RESULT & SHIFT ASSIGNMENT</h3>
                <HealthDecisionCard 
                  decision={getGuidance(identifiedWorker)}
                  vitals={[
                    { label: 'Heart Rate', value: '72 bpm' },
                    { label: 'Oxygen Level', value: '99%' }
                  ]}
                />
              </div>

              {viewState === 'RESULTS' && (
                <div className="card" style={{ animation: 'slide-up 0.5s ease-out' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>MANUAL ADMIN DECISION</h3>
                  
                  {identifiedWorker.status === 'Outside' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>ASSIGN WORK SHIFT TYPE</label>
                        <select 
                          value={selectedShift} 
                          onChange={(e) => setSelectedShift(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: '#fff' }}
                        >
                          {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={() => handleManualAction('allow_entry')}>ALLOW ENTRY / CHECK-IN</button>
                        <button className="btn btn-danger" onClick={() => handleManualAction('reject_entry')}>REJECT ENTRY</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }} onClick={() => handleManualAction('allow_exit')}>ALLOW EXIT / CHECK-OUT</button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Outcomes */}
          {viewState === 'SUCCESS_ENTRY' && (
            <div className="card" style={{ textAlign: 'center', border: '2px solid var(--success)', background: 'rgba(46, 204, 113, 0.05)' }}>
               <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
               <h2 style={{ color: 'var(--success)', fontWeight: 'bold' }}>Worker checked in successfully.</h2>
               <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Assigned Shift: <span style={{ fontWeight: 'bold', color: '#fff' }}>{finalAssignedShift}</span></p>
               <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }} onClick={resetProcess}>PROCESS NEXT WORKER</button>
            </div>
          )}

          {viewState === 'SUCCESS_REJECT' && (
            <div className="card" style={{ textAlign: 'center', border: '2px solid var(--danger)', background: 'rgba(231, 76, 60, 0.05)' }}>
               <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
               <h2 style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Worker entry rejected due to health condition.</h2>
               <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }} onClick={resetProcess}>PROCESS NEXT WORKER</button>
            </div>
          )}

          {viewState === 'TOMORROW_DECISION' && (
             <EligibilityCard 
               guidance={identifiedWorker.healthEligibility === 'Safe' ? 'Fit' : 'Needs Rest'} 
               onDecision={() => setViewState('SUCCESS_EXIT')} 
             />
          )}

          {viewState === 'SUCCESS_EXIT' && (
             <div className="card" style={{ textAlign: 'center', border: '2px solid var(--info)', background: 'rgba(52, 152, 219, 0.05)' }}>
               <h2 style={{ color: 'var(--info)', fontWeight: 'bold' }}>Exit verification logged.</h2>
               <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }} onClick={resetProcess}>PROCESS NEXT WORKER</button>
             </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan-move { 0% { top: 0% } 50% { top: 100% } 100% { top: 0% } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
};

// Simple internal fix for grid typo from my previous draft
const grid = "grid";

export default WorkerAttendance;
