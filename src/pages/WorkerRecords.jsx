import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCard, StatusBadge, StatCard } from '../components/ui/UIComponents';
import { workers, stats } from '../data/dummyData';

const WorkerRecords = () => {
  const navigate = useNavigate();
  
  const summary = {
    total: stats.find(s => s.id === 1)?.value || '0',
    inside: stats.find(s => s.id === 2)?.value || '0',
    outside: stats.find(s => s.id === 3)?.value || '0',
    rejected: stats.find(s => s.id === 4)?.value || '0',
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Registered Workers & Work Status</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Comprehensive database of mine personnel and their current status.</p>
      
      {/* Summary Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard label="Total Registered" value={summary.total} icon="📝" color="var(--info)" />
        <StatCard label="Currently Inside" value={summary.inside} icon="⛏️" color="var(--success)" />
        <StatCard label="Currently Outside" value={summary.outside} icon="🚪" color="var(--text-secondary)" />
        <StatCard label="Rejected Entry Today" value={summary.rejected} icon="🚫" color="var(--danger)" />
      </div>

      {/* Table Section */}
      <TableCard title="Master Personnel List">
        <table>
          <thead>
            <tr>
              <th>Worker ID</th>
              <th>Name</th>
              <th>Dept / Zone</th>
              <th>Work Status</th>
              <th>Health Guidance</th>
              <th>Last Entry Decision</th>
              <th>Tomorrow Eligibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(worker => (
              <tr key={worker.id}>
                <td style={{ fontWeight: 'bold' }}>{worker.id}</td>
                <td>{worker.name}</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{worker.department}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{worker.zone}</div>
                </td>
                <td><StatusBadge status={worker.status.toUpperCase()} /></td>
                <td>
                   <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      color: worker.healthEligibility === 'Safe' ? 'var(--success)' : (worker.healthEligibility === 'Warning' ? 'var(--warning)' : 'var(--danger)')
                   }}>
                     ● {worker.healthEligibility === 'Safe' ? 'Safe Range' : (worker.healthEligibility === 'Warning' ? 'Attention' : 'High Risk')}
                   </span>
                </td>
                <td>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: worker.lastEntryDecision === 'Allowed' ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 'bold'
                  }}>
                    {worker.lastEntryDecision}
                  </span>
                </td>
                <td>
                   <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      color: worker.tomorrowEligibility === 'Fit' ? 'var(--success)' : 'var(--danger)'
                   }}>
                     {worker.tomorrowEligibility}
                   </span>
                </td>
                <td>
                  <button 
                    onClick={() => navigate('/worker-attendance')}
                    style={{ background: 'var(--accent-primary)', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}
                  >
                    IDENTIFY
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
};

export default WorkerRecords;
