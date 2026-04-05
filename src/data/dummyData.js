export const stats = [
  { id: 1, label: 'Total Registered Workers', value: '450', icon: '📝', trend: '+12', color: 'var(--info)' },
  { id: 2, label: 'Workers Currently Inside Mine', value: '68', icon: '⛏️', trend: 'N/A', color: 'var(--success)' },
  { id: 3, label: 'Workers Outside Mine', value: '382', icon: '🚪', trend: 'N/A', color: 'var(--text-secondary)' },
  { id: 4, label: 'Blocked / Rejected Workers Today', value: '5', icon: '🚫', trend: 'Action Required', color: 'var(--danger)' },
  { id: 5, label: 'Health Alerts Today', value: '3', icon: '⚠️', trend: 'High Risk', color: 'var(--warning)' },
  { id: 6, label: 'Admins Registered', value: '4', icon: '👨‍💼', trend: 'Active', color: 'var(--accent-primary)' },
];

export const admins = [
  { id: 'ADM001', username: 'admin_mining_01', name: 'John Supervisor', role: 'Shift Head', fingerprintEnrolled: true },
  { id: 'ADM002', username: 'asst_manager', name: 'Sarah Wilson', role: 'Assistant Manager', fingerprintEnrolled: true },
];

export const workers = [
  { 
    id: 'W101', name: 'John Doe', age: 34, department: 'Excavation', zone: 'Sector A', 
    shift: 'Morning', phone: '9876543210', status: 'Inside', fingerprintStatus: 'Enrolled', 
    healthEligibility: 'Safe', tomorrowEligibility: 'Fit', lastCheckIn: '08:00 AM', 
    lastCheckOut: '04:15 PM (Yesterday)', lastEntryDecision: 'Allowed', previousShift: 'Morning' 
  },
  { 
    id: 'W102', name: 'Robert Smith', age: 29, department: 'Maintenance', zone: 'Sector B', 
    shift: 'To be assigned', phone: '9876543211', status: 'Outside', fingerprintStatus: 'Enrolled', 
    healthEligibility: 'Safe', tomorrowEligibility: 'Fit', lastCheckIn: '04:00 PM (Yesterday)', 
    lastCheckOut: '12:10 AM', lastEntryDecision: 'Allowed', previousShift: 'Evening' 
  },
  { 
    id: 'W103', name: 'Michael Brown', age: 41, department: 'Safety', zone: 'Sector A', 
    shift: 'Inside', phone: '9876543212', status: 'Inside', fingerprintStatus: 'Enrolled', 
    healthEligibility: 'Warning', tomorrowEligibility: 'Needs Rest', lastCheckIn: '12:00 AM', 
    lastCheckOut: '08:15 AM (Yesterday)', lastEntryDecision: 'Allowed', previousShift: 'Night' 
  },
  { 
    id: 'W104', name: 'David Wilson', age: 31, department: 'Excavation', zone: 'Sector C', 
    shift: 'To be assigned', phone: '9876543213', status: 'Outside', fingerprintStatus: 'Enrolled', 
    healthEligibility: 'Blocked', tomorrowEligibility: 'Not Eligible', lastCheckIn: 'N/A', 
    lastCheckOut: 'N/A', lastEntryDecision: 'Rejected', previousShift: 'Morning' 
  },
  { 
    id: 'W105', name: 'James Taylor', age: 38, department: 'Logistics', zone: 'Sector B', 
    shift: 'To be assigned', phone: '9876543214', status: 'Outside', fingerprintStatus: 'Enrolled', 
    healthEligibility: 'Safe', tomorrowEligibility: 'Fit', lastCheckIn: '08:15 AM (Yesterday)', 
    lastCheckOut: '04:30 PM', lastEntryDecision: 'Allowed', previousShift: 'Morning' 
  },
  { 
    id: 'W106', name: 'Sarah Miller', age: 27, department: 'Safety', zone: 'Sector C', 
    shift: 'To be assigned', phone: '9876543215', status: 'Blocked', fingerprintStatus: 'Enrolled', 
    healthEligibility: 'Critical', tomorrowEligibility: 'Not Eligible', lastCheckIn: 'N/A', 
    lastCheckOut: 'N/A', lastEntryDecision: 'Rejected', previousShift: 'Evening' 
  },
];

export const healthAlerts = [
  { id: 1, workerId: 'W101', name: 'John Doe', type: 'Low SpO2 Drop', value: '88%', status: 'Critical', time: '10:30 AM' },
  { id: 2, workerId: 'W112', name: 'Chris Evans', type: 'Low SpO2', value: '92%', status: 'Warning', time: '11:15 AM' },
  { id: 3, workerId: 'W105', name: 'James Taylor', type: 'High HR', value: '115 bpm', status: 'Critical', time: '12:00 PM' },
];

export const analyticsData = {
  workerId: 'W101',
  name: 'John Doe',
  department: 'Excavation',
  currentStatus: 'Safe',
  safetyScore: 92,
  abnormalDays: 1,
  sevenDayHistory: [
    { day: 'Mon', heartRate: 72, spo2: 99, status: 'Safe' },
    { day: 'Tue', heartRate: 75, spo2: 98, status: 'Safe' },
    { day: 'Wed', heartRate: 82, spo2: 97, status: 'Warning' },
    { day: 'Thu', heartRate: 98, spo2: 95, status: 'Critical' },
    { day: 'Fri', heartRate: 74, spo2: 99, status: 'Safe' },
    { day: 'Sat', heartRate: 71, spo2: 99, status: 'Safe' },
    { day: 'Sun', heartRate: 70, spo2: 99, status: 'Safe' },
  ]
};

export const departments = ['Excavation', 'Maintenance', 'Safety', 'Logistics', 'Blast Operations', 'Ventilation'];
export const zones = ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'Main Shaft', 'Secondary Entry'];
export const shifts = ['Morning (08:00 - 16:00)', 'Evening (16:00 - 00:00)', 'Night (00:00 - 08:00)'];
