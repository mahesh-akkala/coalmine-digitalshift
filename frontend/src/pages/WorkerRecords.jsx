import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCard, StatusBadge, StatCard, InfoBanner } from '../components/ui/UIComponents';

const WorkerRecords = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers');
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error('Error fetching workers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('🚨 WARNING: Entire operative profile and health history will be permanently purged. Proceed?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/workers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setWorkers(workers.filter(w => w.id !== id && w._id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error('Purge failure:', err);
    }
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const summary = {
    total: workers.length,
    inside: workers.filter(w => w.status === 'Inside').length,
    outside: workers.filter(w => w.status === 'Outside').length,
    critical: workers.filter(w => w.healthEligibility === 'Critical').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Personnel Master Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: '500' }}>
            Central database for workforce monitoring and compliance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/worker-registration')}>
            ➕ ADD PERSONNEL
          </button>
        </div>
      </div>
      
      {/* Summary Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard label="Total Force" value={summary.total.toString()} icon="👷" color="var(--info)" />
        <StatCard label="Active Duty (Underground)" value={summary.inside.toString()} icon="⛏️" color="var(--success)" />
        <StatCard label="Off-Shift (Surface)" value={summary.outside.toString()} icon="🏠" color="var(--text-secondary)" />
        <StatCard label="Critical Alerts" value={summary.critical.toString()} icon="🚨" color="var(--danger)" />
      </div>

      {isLoading ? (
        <div className="card glass" style={{ textAlign: 'center', padding: '5rem' }}>
           <div style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>⌛</div>
           <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Decrypting records from secure vault...</p>
        </div>
      ) : (
        <TableCard title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Registry Records</span>
            <div style={{ position: 'relative', width: '280px' }}>
              <input 
                type="text" 
                placeholder="Search operative..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.6rem 2.5rem 0.6rem 1rem',
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.8rem' }}>🔍</span>
            </div>
          </div>
        }>
          <table>
            <thead>
              <tr>
                <th>Profile ID</th>
                <th>Full Name</th>
                <th>Dept / Zone</th>
                <th>Current Status</th>
                <th>Bio ID</th>
                <th>Health Status</th>
                <th>Last Incident</th>
                <th>Control</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map(worker => (
                <tr key={worker._id}>
                  <td style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>{worker.id}</td>
                  <td style={{ fontWeight: '500' }}>{worker.name}</td>
                  <td>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{worker.department}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{worker.zone}</div>
                  </td>
                  <td><StatusBadge status={worker.status.toUpperCase()} /></td>
                  <td>
                    <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                      #{worker.fingerprintId || 'N/A'}
                    </code>
                  </td>
                  <td><StatusBadge status={worker.healthEligibility} /></td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {worker.updatedAt ? new Date(worker.updatedAt).toLocaleTimeString() : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: '800' }}
                        onClick={() => navigate('/worker-attendance')}
                      >
                        LOGS
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem', borderColor: 'var(--danger)', color: 'var(--danger)', background: 'rgba(220,53,69,0.05)' }}
                        onClick={() => handleDelete(worker.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredWorkers.length === 0 && (
                <tr>
                   <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                     No workforce records available in current search range.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableCard>
      )}
    </div>
  );
};

export default WorkerRecords;
