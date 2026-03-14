# 🚀 Task Management System

> A production-ready Full-Stack Task Management application built as a 24-hour technical assessment.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

| 🔗 Frontend (Vercel) | ⚙️ Backend (Render) | 📁 GitHub |
|---|---|---|
| [task-manager-assessment-eight.vercel.app](https://task-manager-assessment-eight.vercel.app/) | [task-manager-assessment-ramf.onrender.com](https://task-manager-assessment-ramf.onrender.com) | [Aditya-Shukla4/Task-Manager-Assessment](https://github.com/Aditya-Shukla4/Task-Manager-Assessment) |

---

## 📌 Project Overview

This project demonstrates full-stack expertise through secure authentication, AES-256 encrypted API communication, paginated REST APIs, real-time filters, and a polished responsive UI — all deployed on cloud platforms.

---

## 🏗️ Architecture Overview

The application follows a clean **MVC (Model-View-Controller)** pattern with a fully decoupled frontend and backend, each deployed independently.

```
Client (React/Vercel)
        │
        │  HTTPS + AES-256 Encrypted Payloads
        ▼
Server (Express/Render)
        │
        ├── Routes → Controllers → Models
        │
        ▼
 MongoDB Atlas (Cloud DB)
```

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | UI, state management, AES decryption |
| Backend | Node.js + Express | REST API, JWT auth, AES encryption, business logic |
| Database | MongoDB Atlas | Persistent storage with Mongoose ODM |
| Auth Layer | JWT + HTTP-Only Cookies | Stateless auth, XSS/CSRF protection |
| Encryption | AES-256 (CryptoJS) | Encrypts all sensitive API response payloads |

### 📁 Folder Structure

```
Task-Manager-Assessment/
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # AuthContext for global auth state
│   │   ├── pages/            # Login, Register, Dashboard
│   │   └── utils/            # Axios instance, crypto helpers
│   └── vercel.json           # SPA routing fix
│
└── server/                   # Node.js + Express Backend
    ├── controllers/          # Business logic (auth, tasks)
    ├── middleware/            # JWT verification, error handlers
    ├── models/               # Mongoose schemas (User, Task)
    ├── routes/               # API route definitions
    └── utils/                # AES encrypt/decrypt helpers
```

---

## 🛠️ Tech Stack

| Category | Technology | Notes |
|---|---|---|
| Runtime | Node.js | ES6+ |
| Framework | Express.js | REST API server |
| Frontend | React + Vite | SPA with React Router v6 |
| Styling | Tailwind CSS v3 | Utility-first, glass-morphism UI |
| Database | MongoDB Atlas | Cloud-hosted, Mongoose ODM |
| Auth | JWT (JSON Web Tokens) | Stored in HTTP-Only Cookies |
| Encryption | CryptoJS (AES-256) | Payload encryption/decryption |
| Password Hashing | bcrypt.js | Salt rounds: 10 |
| HTTP Client | Axios | Custom instance, `withCredentials: true` |
| Frontend Deploy | Vercel | Auto-deploy from GitHub |
| Backend Deploy | Render | Web Service with env vars |

---

## 🔐 Security Implementation

Security was treated as a **first-class requirement**. Here's what was implemented and why:

### 1. AES-256 Payload Encryption
All sensitive data returned from the API is **encrypted server-side** before being sent to the client. The client decrypts the payload using CryptoJS.

- Prevents data theft even if traffic is intercepted
- Encryption key stored in environment variables — never hardcoded

### 2. JWT via HTTP-Only Cookies
Authentication tokens are stored in **HTTP-Only cookies** instead of `localStorage`.

- **HTTP-Only flag** — JavaScript cannot read the cookie, preventing XSS token theft
- **Secure flag** — Cookie only transmitted over HTTPS in production
- **SameSite** — Prevents cross-origin cookie sending (CSRF protection)

### 3. Password Security
- Passwords hashed with **bcrypt.js** (10 salt rounds) before storage
- Plain-text passwords are never stored or logged anywhere

### 4. Input Validation & CORS
- All user inputs validated server-side via Express middleware
- CORS configured to allow **only** the specific Vercel frontend origin
- Semantic HTTP status codes used throughout (`401`, `403`, `404`, `422`)

---

## 🗄️ Database Design

### User Schema
```js
User {
  name:      String   // required, trimmed
  email:     String   // required, unique, lowercase
  password:  String   // required, bcrypt hashed — plain text never stored
  createdAt: Date     // auto-generated
}
```

### Task Schema
```js
Task {
  title:       String   // required, trimmed
  description: String   // optional
  status:      Enum     // 'Pending' | 'In Progress' | 'Completed'
  userId:      ObjectId // ref: User — enforces strict user-task isolation
  createdAt:   Date     // auto-generated
}
```

> The `userId` field on every Task ensures strict data isolation. All DB queries filter by the `userId` extracted from the verified JWT — users can never access another user's tasks.

---

## 📡 API Documentation

**Base URL:** `https://task-manager-assessment-ramf.onrender.com/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login and receive JWT cookie | No |
| `POST` | `/auth/logout` | Clear JWT cookie | Yes |

#### `POST /auth/register`
**Request:**
```json
{
  "name": "Aditya",
  "email": "aditya@example.com",
  "password": "secret123"
}
```
**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

#### `POST /auth/login`
**Request:**
```json
{
  "email": "aditya@example.com",
  "password": "secret123"
}
```
**Response `200`:**
```json
{
  "success": true,
  "user": { "id": "abc123", "name": "Aditya", "email": "aditya@example.com" }
}
```
> JWT token is automatically set as an HTTP-Only cookie. No token in the response body.

---

### Task Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/tasks` | Get paginated tasks (with filters) | ✅ |
| `POST` | `/tasks` | Create a new task | ✅ |
| `PUT` | `/tasks/:id` | Update task (title/description/status) | ✅ |
| `DELETE` | `/tasks/:id` | Delete a task | ✅ |

#### `GET /tasks` — Query Parameters

| Parameter | Type | Example | Description |
|---|---|---|---|
| `page` | Number | `1` | Page number (default: 1) |
| `limit` | Number | `10` | Tasks per page (default: 10) |
| `status` | String | `Pending` | Filter by status |
| `search` | String | `meeting` | Search within task title |

**Example:** `GET /tasks?page=1&limit=10&status=Pending&search=fix`

**Response `200` — Encrypted:**
```json
{
  "success": true,
  "data": "<AES-256 encrypted string>"
}
```
> Client decrypts `data` using CryptoJS to get:
```json
{
  "tasks": [...],
  "totalPages": 5,
  "currentPage": 1,
  "totalTasks": 47
}
```

#### `POST /tasks`
**Request:**
```json
{
  "title": "Fix login bug",
  "description": "JWT expiry issue on mobile",
  "status": "Pending"
}
```
**Response `201`:**
```json
{
  "success": true,
  "task": {
    "_id": "xyz789",
    "title": "Fix login bug",
    "description": "JWT expiry issue on mobile",
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Aditya-Shukla4/Task-Manager-Assessment.git
cd Task-Manager-Assessment
```

### Step 2 — Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_32_character_random_secret_key
AES_SECRET_KEY=your_32_character_aes_encryption_key
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

### Step 3 — Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_AES_KEY=your_32_character_aes_encryption_key
```

Start the frontend:
```bash
npm run dev
```

| Service | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 🚀 Deployment

| Service | Platform | Details |
|---|---|---|
| Frontend | Vercel | Auto-deploys from GitHub `main`. `vercel.json` handles SPA routing. |
| Backend | Render | Web Service. All env vars set in Render dashboard. |
| Database | MongoDB Atlas | Cloud cluster. IP whitelist set to `0.0.0.0/0` for Render compatibility. |

### Environment Variables (Production)
No secrets are hardcoded. All sensitive values are stored in platform dashboards:
- **Render** → `MONGO_URI`, `JWT_SECRET`, `AES_SECRET_KEY`, `CLIENT_URL`
- **Vercel** → `VITE_API_URL`, `VITE_AES_KEY`

---

## 📊 Assessment Criteria Mapping

| Criteria | Weight | Implementation |
|---|---|---|
| Code Structure & Architecture | 20% | MVC pattern, separated routes/controllers/models/utils |
| Authentication & Security | 20% | JWT + HTTP-Only Cookies, AES-256, bcrypt, CORS, input validation |
| Database Design & Queries | 15% | Mongoose schemas with validation, `userId` isolation |
| API Design & Error Handling | 15% | RESTful endpoints, structured JSON, semantic HTTP status codes |
| Frontend Integration & UX | 10% | React + Tailwind, AuthContext, protected routes, real-time filters |
| Deployment & DevOps | 10% | Vercel + Render, GitHub source, env vars in dashboards |
| Documentation & Clarity | 10% | Architecture diagram, API docs, setup guide, security rationale |

---

*Built by Aditya Shukla — Full Stack Developer — 24-Hour Assessment*
