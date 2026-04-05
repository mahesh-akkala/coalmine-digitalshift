import React from 'react';
import { TableCard, StatCard } from '../components/ui/UIComponents';

const Reports = () => {
  const reports = [
    { title: 'Daily Shift Summary', date: '2026-04-05', size: '1.2 MB', status: 'Generated' },
    { title: 'Weekly Health Trends', date: '2026-04-05', size: '3.5 MB', status: 'Processing' },
    { title: 'Critical Incident Log', date: '2026-04-04', size: '0.8 MB', status: 'Archived' },
    { title: 'Worker Attendance - Sector A', date: '2026-04-04', size: '2.1 MB', status: 'Archived' },
    { title: 'Monthly Safety Audit', date: '2026-03-31', size: '12.4 MB', status: 'Archived' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>System Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1rem', border: '2px dashed var(--border-color)', background: 'transparent' }}>
           <div style={{ fontSize: '2.5rem' }}>📄</div>
           <h4>Generate New Report</h4>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose parameters to create a custom data export.</p>
           <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>REPORTS BUILDER</button>
        </div>
        <div className="card">
           <h4 style={{ marginBottom: '1.5rem' }}>Quick Exports</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                Workers Inside Mine <span>📥 PDF</span>
              </button>
              <button className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                Today's Health Alerts <span>📥 XLS</span>
              </button>
              <button className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                Shift Completion Logs <span>📥 CSV</span>
              </button>
           </div>
        </div>
        <div className="card" style={{ background: 'var(--accent-primary)', color: '#000' }}>
           <h4 style={{ marginBottom: '1rem' }}>Scheduled Sync</h4>
           <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Auto-sync with Mining Ministry portal is scheduled for 18:00 HRS.</p>
           <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Status: READY</div>
           <button className="btn btn-primary" style={{ background: '#000', color: 'var(--accent-primary)', width: '100%', marginTop: '1.5rem' }}>FORCE SYNC</button>
        </div>
      </div>

      <TableCard title="Recent Report History">
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Generated Date</th>
              <th>File Size</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{report.title}</td>
                <td>{report.date}</td>
                <td>{report.size}</td>
                <td>
                   <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      background: report.status === 'Generated' ? 'rgba(46, 204, 113, 0.2)' : (report.status === 'Processing' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(209, 213, 219, 0.1)'),
                      color: report.status === 'Generated' ? 'var(--success)' : (report.status === 'Processing' ? 'var(--warning)' : 'var(--text-secondary)')
                   }}>
                     {report.status}
                   </span>
                </td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                   <button style={{ background: 'none', color: 'var(--info)', fontSize: '0.8rem' }}>Download</button>
                   <button style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
};

export default Reports;
