import React from 'react';

const Settings = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>System Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        {/* Profile/Admin Settings */}
        <div className="card">
           <h3 style={{ marginBottom: '1.5rem' }}>👨‍💼 Admin Profile</h3>
           <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#000', fontWeight: 'bold' }}>
                AD
              </div>
              <h4 style={{ fontSize: '1.2rem' }}>Admin Supervisor</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>License ID: MIN-102-SUP</p>
           </div>
           
           <div style={{ marginBottom: '1.2rem' }}>
              <label>Display Name</label>
              <input type="text" defaultValue="Admin Supervisor" />
           </div>
           <div style={{ marginBottom: '2rem' }}>
              <label>Email Address</label>
              <input type="email" defaultValue="admin.mining@gov.in" />
           </div>
           <button className="btn btn-primary" style={{ width: '100%' }}>UPDATE PROFILE</button>
           <button className="btn btn-outline" style={{ width: '100%', marginTop: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>LOGOUT</button>
        </div>

        {/* System & Alert Thresholds */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
           <div className="card">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔔 Alert Thresholds (Manual Overrides)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                 Define the global parameters that trigger system-wide health alerts.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                 <div>
                    <label>Temperature Threshold (°F)</label>
                    <input type="number" defaultValue="101.5" />
                 </div>
                 <div>
                    <label>Heart Rate Threshold (BPM)</label>
                    <input type="number" defaultValue="120" />
                 </div>
                 <div>
                    <label>SpO2 Critical Level (%)</label>
                    <input type="number" defaultValue="93" />
                 </div>
                 <div>
                    <label>Gas Toxicity Warning (PPM)</label>
                    <input type="number" defaultValue="35" />
                 </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '2rem' }}>SAVE THRESHOLDS</button>
           </div>

           <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>⚙️ System Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <div style={{ fontWeight: 600 }}>Real-time Biometric Sync</div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Keep local database synced with cloud every 5 mins.</p>
                    </div>
                    <input type="checkbox" style={{ width: '20px' }} defaultChecked />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <div style={{ fontWeight: 600 }}>Emergency Siren Integration</div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allow supervisor portal to trigger physical alarms.</p>
                    </div>
                    <input type="checkbox" style={{ width: '20px' }} defaultChecked />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <div style={{ fontWeight: 600 }}>Auto-Report Generation</div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automatically generate daily shift logs at 00:00 HRS.</p>
                    </div>
                    <input type="checkbox" style={{ width: '20px' }} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
