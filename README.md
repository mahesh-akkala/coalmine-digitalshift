# Coal Mine Digital Shift Monitoring System 👷⛏️

A comprehensive digital ecosystem designed for real-time monitoring of underground coal mine operations, focusing on worker safety, health analytics, and shift management.

## 🚀 Overview

This system provides a high-tech dashboard for supervisors to track worker population, monitor real-time biometric telemetry (heart rate, SpO2), and manage personnel registration and shift authorization.

### Key Features
- **Real-time Health Dashboard**: Live monitoring of worker vitals via Socket.io.
- **Biometric Authentication**: Integration with ESP32 and fingerprint sensors for secure shift entry/exit.
- **Automated Health Compliance**: Real-time status assessment (Safe, Warning, Critical).
- **Shift Management**: Digital check-in/check-out logs with automated population tracking.
- **Admin Analytics**: Detailed history and records for safety audits.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Socket.io Client, CSS3 (Glassmorphism), React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Hardware**: ESP32, MAX30100/MAX30102, Fingerprint Sensor AS608.

## 📂 Project Structure

```text
coalmine-frontend/
├── backend/            # Express Server & MongoDB Models
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose schemas (Worker, Scan, Admin)
│   └── server.js       # Main API & Socket server
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application views (Dashboard, Attendance, etc.)
│   │   └── App.jsx     # Main routing and layout
│   └── vite.config.js  # Vite configuration
└── package.json        # Root management for parallel execution
```

## 🚥 Getting Started

### Prerequisites
- Node.js installed.
- MongoDB running (locally at `mongodb://localhost:27017/coalmine` or via `.env`).

### Installation

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install service dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Running the Application

To start both the backend and frontend simultaneously from the root directory:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## 📞 Support & Logs
For any hardware synchronization issues, ensure the ESP32 is flashed with the provided firmware in the `ESP32_CoalMine_Firmware` directory.
