# FitAI X - Onboarding Application

**FitAI X** is a modern, full-stack fitness onboarding application designed to collect user personal details, fitness goals, training preferences, equipment access, health conditions, and dietary requirements. The application features a dynamic multi-step frontend onboarding flow and a modular Express backend connected to a Neon PostgreSQL database.

---

## 🚀 Features

- **Dynamic Multi-Step Onboarding**: Smooth step-by-step questionnaire with auto-saving progress.
- **Fitness Customization**: Collects detailed data including main goals, event training details, workout days/duration, equipment access, injuries, sleep, and dietary preferences.
- **RESTful API Backend**: Built with Express and PostgreSQL (Neon Cloud DB) supporting full CRUD & upsert operations for user onboarding responses.
- **Concurrent Development**: Single command to launch both frontend (Vite React) and backend (Express API) concurrently.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern Custom CSS (Flexbox/Grid, Glassmorphism, Responsive design)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [Neon Cloud PostgreSQL](https://neon.tech/) via `pg` (node-postgres)
- **Environment Management**: `dotenv`

---

## 📁 Repository Structure

```text
fitai/
├── backend/                  # Node.js + Express API server
│   ├── controllers/          # Request handlers & logic
│   ├── routes/               # Express API routes
│   ├── db.js                 # Database connection pool (Neon PostgreSQL)
│   ├── server.js             # Entry point for backend server
│   └── package.json
├── frontend/                 # Vite + React frontend application
│   ├── src/                  # React components, pages, data, & CSS
│   │   ├── components/       # Step components & UI elements
│   │   ├── data/             # Form steps and questions data
│   │   ├── App.jsx           # Main application container
│   │   └── index.css         # Main stylesheet
│   ├── index.html            # HTML entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json
├── .env                      # Environment configuration (DB credentials & Port)
├── API_DOCUMENTATION.md      # Detailed API endpoints documentation
├── package.json              # Monorepo root script runner
└── README.md                 # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Installation

Clone the repository and install all dependencies (root, backend, and frontend) with a single command:

```bash
npm run install:all
```

### 2. Environment Setup

Create a `.env` file in the root directory (or in `backend/.env`) with your database credentials and backend port:

```env
PORT=5000
DATABASE_URL=postgresql://<username>:<password>@<neon-hostname>/<dbname>?sslmode=require
```

### 3. Running the Application

#### Development Mode (Frontend + Backend)
Run both backend API server and frontend Vite dev server concurrently:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173` (or port specified by Vite)
- **Backend API**: `http://localhost:5000`

#### Individual Services

- **Backend only**:
  ```bash
  npm run dev:backend
  ```
- **Frontend only**:
  ```bash
  npm run dev:frontend
  ```

---

## 📡 API Overview

For detailed API specifications, payloads, and response examples, refer to [API_DOCUMENTATION.md](file:///c:/Users/HP/Desktop/fitai/API_DOCUMENTATION.md).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & DB connection check |
| `POST` | `/api/onboarding` | Submit or save onboarding progress (Upsert) |
| `GET` | `/api/onboarding/:email` | Get onboarding response by user email |
| `GET` | `/api/onboarding` | List all onboarding responses |
| `DELETE` | `/api/onboarding/:email` | Delete onboarding record for email |

---

## 📄 License

ISC License
