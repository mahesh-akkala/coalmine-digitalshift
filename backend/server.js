const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Models
const Worker = require('./models/Worker');
const Admin = require('./models/Admin');
const Scan = require('./models/Scan');

// Initialize App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// --- API ROUTES ---

// 1. ESP32: Sensor Data Ingestion
app.post('/api/sensor-data', async (req, res) => {
  try {
    const { fingerprintId, heartRate, spo2 } = req.body;
    console.log(`📥 Hardware Pulse: Fingerprint#${fingerprintId} | HR:${heartRate} | SpO2:${spo2}`);

    // Find worker linked to this fingerprint slot
    const worker = await Worker.findOne({ fingerprintId });
    if (!worker) {
      return res.status(404).json({ error: 'Unrecognized Biometric Template' });
    }

    // Evaluate health state
    let state = 'Safe';
    if (heartRate > 100 || spo2 < 94) state = 'Warning';
    if (heartRate > 120 || spo2 < 90) state = 'Critical';

    // Persist scan history
    const newScan = new Scan({
      workerId: worker.id,
      fingerprintId,
      heartRate,
      spo2,
      status: state
    });
    await newScan.save();

    // Update worker status in real-time
    worker.healthEligibility = state;
    await worker.save();

    // Broadcast to Dashboard
    io.emit('new_scan', {
      worker,
      vitals: { heartRate, spo2 },
      status: state,
      timestamp: new Date()
    });

    res.status(200).json({ message: 'Telemetry Synced', workerId: worker.id });
  } catch (err) {
    console.error('Sensor Data Error:', err);
    res.status(500).json({ error: 'Telemetry Sync Failure' });
  }
});

// 2. Supervisor: Registration
app.post('/api/admins/register', async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json({ message: 'Supervisor Authorized', admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Supervisor: Login
app.post('/api/admins/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (!admin) return res.status(401).json({ error: 'Shield Denied: Invalid Credentials' });
    res.status(200).json({ message: 'Access Granted', admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Workforce: Get All
app.get('/api/workers', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Database Link Failure' });
  }
});

// 5. Workforce: Enroll
app.post('/api/workers', async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json(worker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Workforce: Deletion
app.delete('/api/workers/:id', async (req, res) => {
  try {
    // Delete worker by custom ID or MongoDB ID
    const worker = await Worker.findOneAndDelete({ id: req.params.id }) || 
                   await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Operative Not Found' });
    res.json({ message: 'Operative Purged From System' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Operations: Check-In
app.post('/api/workers/:id/check-in', async (req, res) => {
  try {
    const worker = await Worker.findOne({ id: req.params.id });
    if (!worker) return res.status(404).json({ error: 'Operative Not Found' });

    worker.status = 'Inside';
    worker.lastCheckIn = new Date();
    await worker.save();

    res.json({ message: 'Underground Entry Logged', worker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Operations: Check-Out
app.post('/api/workers/:id/check-out', async (req, res) => {
  try {
    const worker = await Worker.findOne({ id: req.params.id });
    if (!worker) return res.status(404).json({ error: 'Operative Not Found' });

    worker.status = 'Outside';
    worker.lastCheckOut = new Date();
    await worker.save();

    res.json({ message: 'Surface Exit Logged', worker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket Events
io.on('connection', (socket) => {
  console.log('📡 Dashboard Terminal Connected');
  socket.on('disconnect', () => console.log('📡 Dashboard Terminal Offline'));
});

// Server Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Control Center Active on Port ${PORT}`);
});
