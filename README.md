# Budget Manager - Purchase Safety Evaluator 💸

A full-stack financial evaluation application built with a **Node.js Express** backend, a **React + Tailwind CSS** frontend, and **PostgreSQL** integration (with local in-memory fallback mode).

Designed to help users evaluate whether an intended purchase fits safely within their disposable income before their next payday.

---

## 🌟 Key Features

- **Financial Safety Evaluator (`POST /api/check-purchase`)**: Calculates remaining disposable cash and daily allowance until payday in Indian Rupees (`₹` / `INR`).
- **Dynamic Status Indicator**: Displays a clear **Safe to Buy** (Green) or **Warning: Exceeds Safe Budget** (Red) status.
- **Transactions History (`GET /api/transactions`)**: Stores purchase evaluations in PostgreSQL with fallback in-memory history support.
- **Mobile-Friendly UI**: Modern glassmorphism dark theme using Tailwind CSS and Lucide icons.
- **Cloud SQL & Docker Support**: Dockerized frontend (NGINX) and backend (Node 20 Alpine) with support for Google Cloud SQL Unix sockets (`INSTANCE_CONNECTION_NAME`).

---

## 📁 Repository Structure

```text
budget-manager/
├── backend/                  # Node.js Express Server
│   ├── src/
│   │   ├── config/           # Database pool & initDb scripts
│   │   ├── controllers/      # Purchase evaluation & transactions logic
│   │   └── index.js          # Express app entry point
│   ├── Dockerfile            # Container configuration (Port 5000)
│   └── package.json
├── frontend/                 # React 18 + Vite + Tailwind CSS UI
│   ├── src/
│   │   ├── components/       # Header, PurchaseForm, StatusBanner, MetricsBreakdown
│   │   └── App.jsx
│   ├── Dockerfile            # Multi-stage NGINX build (Port 80)
│   ├── nginx.conf
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
# Listens on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 🐳 Docker Setup

### Build & Run Backend
```bash
cd backend
docker build -t budget-backend .
docker run -p 5000:5000 budget-backend
```

### Build & Run Frontend
```bash
cd frontend
docker build -t budget-frontend .
docker run -p 80:80 budget-frontend
```

---

## 🛢️ Database Configuration (PostgreSQL)

Set environment variables to connect to a PostgreSQL database:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DB_USER` | PostgreSQL Username | `postgres` |
| `DB_PASS` | PostgreSQL Password | `postgres` |
| `DB_NAME` | Database Name | `budget_db` |
| `DB_HOST` | Database Host | `localhost` |
| `DB_PORT` | Port Number | `5432` |
| `INSTANCE_CONNECTION_NAME` | Cloud SQL Connection Name (Cloud Run) | *(unset)* |

*(If PostgreSQL is unavailable, the server automatically operates in local in-memory fallback mode).*
