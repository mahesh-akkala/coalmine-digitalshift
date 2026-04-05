import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const adminData = localStorage.getItem('coalmine_admin');
  const admin = adminData ? JSON.parse(adminData) : { firstName: 'Admin', lastName: 'Supervisor', username: 'admin', email: 'admin.mining@gov.in' };

  const handleLogout = () => {
    localStorage.removeItem('coalmine_admin');
    navigate('/');
  };

  const getInitials = () => {
    return `${admin.firstName.charAt(0)}${admin.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="animate-fade-in">
      <h1 className="page-title" style={{ marginBottom: '2.5rem' }}>Site Supervisor Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '2.5rem' }}>
        {/* Profile/Admin Settings */}
        <div className="card glass">
           <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.05em' }}>👨‍💼 SYSTEM OPERATOR</h3>
           <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: 'var(--accent-primary)', 
                borderRadius: '50%', 
                margin: '0 auto 1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2.5rem', 
                color: '#000', 
                fontWeight: '900',
                boxShadow: '0 0 20px var(--accent-glow)'
              }}>
                {getInitials()}
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.25rem' }}>{admin.firstName} {admin.lastName}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>@{admin.username} | Shift Head</p>
           </div>
           
           <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Display Name</label>
              <input type="text" defaultValue={`${admin.firstName} ${admin.lastName}`} style={{ background: 'rgba(0,0,0,0.2)' }} />
           </div>
           <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Auth Email</label>
              <input type="email" defaultValue={admin.email} style={{ background: 'rgba(0,0,0,0.2)' }} />
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button className="btn btn-primary" style={{ width: '100%', fontWeight: '900', padding: '1.1rem' }}>UPDATE TERMINAL PROFILE</button>
             <button 
               onClick={handleLogout}
               className="btn btn-outline" 
               style={{ width: '100%', fontWeight: '900', padding: '1.1rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
             >
               TERMINATE SESSION (LOGOUT)
             </button>
           </div>
        </div>

        {/* System & Alert Thresholds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className="card glass">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800' }}>
                <span style={{ fontSize: '1.4rem' }}>🔔</span> SAFETY THRESHOLDS
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                 Adjust site-wide health parameters for automated biometric alert generation.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                 <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Temp (°F)</label>
                    <input type="number" defaultValue="101.5" />
                 </div>
                 <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Heart Rate (BPM)</label>
                    <input type="number" defaultValue="120" />
                 </div>
                 <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Min SpO2 (%)</label>
                    <input type="number" defaultValue="93" />
                 </div>
                 <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gas Toxicity (PPM)</label>
                    <input type="number" defaultValue="35" />
                 </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '2.5rem', width: 'fit-content', padding: '1rem 2rem' }}>SAVE SYSTEM PARAMETERS</button>
           </div>

           <div className="card glass">
              <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>⚙️ OPERATIONAL PREFERENCES</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                       <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Real-time Biometric Sync</div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Keep local database synced with cloud every 5 mins.</p>
                    </div>
                    <input type="checkbox" style={{ width: '22px', height: '22px', accentColor: 'var(--accent-primary)' }} defaultChecked />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                       <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Emergency Siren Integration</div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allow supervisor portal to trigger physical alarms.</p>
                    </div>
                    <input type="checkbox" style={{ width: '22px', height: '22px', accentColor: 'var(--accent-primary)' }} defaultChecked />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Auto-Report Generation</div>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automatically generate daily shift logs at 00:00 HRS.</p>
                    </div>
                    <input type="checkbox" style={{ width: '22px', height: '22px', accentColor: 'var(--accent-primary)' }} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
