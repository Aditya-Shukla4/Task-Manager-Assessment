Task Management System
Full-Stack Assessment Submission
React  •  Node.js  •  MongoDB  •  AES-256  •  JWT
🔗 Frontend (Vercel)	⚙️ Backend (Render)	📁 GitHub Repository
task-manager-assessment-eight.vercel.app	task-manager-assessment-ramf.onrender.com	github.com/Aditya-Shukla4/Task-Manager-Assessment

📌 Project Overview
A production-ready Task Management application built as a 24-hour technical assessment. This project demonstrates full-stack expertise through secure authentication, encrypted communication, paginated APIs, and a polished responsive UI.

🏗️ Architecture Overview
The application follows a clean MVC (Model-View-Controller) separation with a decoupled frontend and backend deployed independently.

Layer	Technology	Responsibility
Frontend	React (Vite) + Tailwind CSS	UI, state management, AES decryption
Backend	Node.js + Express	REST API, JWT auth, AES encryption, business logic
Database	MongoDB Atlas (Cloud)	Persistent data storage with Mongoose ODM
Auth Layer	JWT + HTTP-Only Cookies	Stateless authentication, XSS/CSRF protection
Encryption	AES-256 (CryptoJS)	Encrypts all sensitive API response payloads

Folder Structure
Task-Manager-Assessment/
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # AuthContext for global state
│   │   ├── pages/            # Login, Register, Dashboard
│   │   └── utils/            # Axios instance, crypto helpers
│   └── vercel.json           # SPA routing fix
└── server/                   # Node.js + Express Backend
    ├── controllers/          # Business logic (auth, tasks)
    ├── middleware/           # JWT verification, error handlers
    ├── models/              # Mongoose schemas (User, Task)
    ├── routes/              # API route definitions
    └── utils/               # AES encrypt/decrypt helpers

🛠️ Tech Stack
Category	Technology	Version / Notes
Runtime	Node.js	ES6+ / CommonJS
Framework	Express.js	REST API server
Frontend	React + Vite	SPA with React Router v6
Styling	Tailwind CSS	v3 — Utility-first, glass-morphism
Database	MongoDB Atlas	Cloud-hosted, Mongoose ODM
Auth	JSON Web Tokens (JWT)	HTTP-Only Cookie storage
Encryption	CryptoJS (AES-256)	Payload encryption/decryption
Password Hashing	bcrypt.js	Salt rounds: 10
HTTP Client	Axios	Custom instance, withCredentials
Frontend Deploy	Vercel	Auto-deploy from GitHub
Backend Deploy	Render	Web Service with env vars

🔐 Security Implementation
Security was treated as a first-class requirement throughout the project. The following measures have been implemented:

1. AES-256 Payload Encryption
All sensitive data returned from the API (task lists, user data) is encrypted server-side using AES-256 before being sent to the client. The client decrypts the payload using the shared secret key via CryptoJS.
•	Prevents data theft even if HTTPS is compromised or traffic is intercepted
•	Encryption key stored in environment variables, never hardcoded

2. JWT via HTTP-Only Cookies
Authentication tokens are stored in HTTP-Only cookies instead of localStorage.
•	HTTP-Only flag: JavaScript cannot read the cookie, preventing XSS token theft
•	Secure flag: Cookie only transmitted over HTTPS in production
•	SameSite: CSRF protection by preventing cross-origin cookie sending

3. Password Security
•	Passwords hashed with bcrypt.js (10 salt rounds) before storing
•	Plain-text passwords are never stored or logged

4. Input Validation & CORS
•	All user inputs validated server-side using Express middleware
•	CORS configured to allow only the specific Vercel frontend origin
•	HTTP status codes used semantically (401 Unauthorized, 403 Forbidden, etc.)

🗄️ Database Design
User Schema
User {
  name:      String  (required, trimmed)
  email:     String  (required, unique, lowercase)
  password:  String  (required, bcrypt hashed)
  createdAt: Date    (auto-generated)
}

Task Schema
Task {
  title:       String  (required, trimmed)
  description: String  (optional)
  status:      Enum    ['Pending', 'In Progress', 'Completed']
  userId:      ObjectId (ref: User — ensures user-task isolation)
  createdAt:   Date    (auto-generated)
}

The userId field on every Task record ensures strict data isolation — users can only query, update, or delete their own tasks. All DB queries filter by the authenticated userId extracted from the JWT.

📡 API Documentation
Base URL
https://task-manager-assessment-ramf.onrender.com/api

Authentication Endpoints
Method	Endpoint	Description	Auth Required
POST	/auth/register	Register a new user	No
POST	/auth/login	Login and receive JWT cookie	No
POST	/auth/logout	Clear JWT cookie	Yes

POST /auth/register — Request
{ "name": "Aditya", "email": "aditya@example.com", "password": "secret123" }
POST /auth/register — Response (201)
{ "success": true, "message": "User registered successfully" }

POST /auth/login — Request
{ "email": "aditya@example.com", "password": "secret123" }
POST /auth/login — Response (200)
{ "success": true, "user": { "id": "...", "name": "Aditya", "email": "..." } }
// JWT token set as HTTP-Only cookie automatically

Task Endpoints
Method	Endpoint	Description	Auth
GET	/tasks	Get paginated tasks (with filters)	Yes
POST	/tasks	Create a new task	Yes
PUT	/tasks/:id	Update task (title/desc/status)	Yes
DELETE	/tasks/:id	Delete a task	Yes

GET /tasks — Query Parameters
Parameter	Type	Example	Description
page	Number	1	Page number (default: 1)
limit	Number	10	Tasks per page (default: 10)
status	String	Pending	Filter by status
search	String	meeting	Search in task title

GET /tasks — Response (200) — ENCRYPTED
{ "success": true, "data": "<AES-256 encrypted string>" }
// Client decrypts data using CryptoJS to get:
// { tasks: [...], totalPages: 5, currentPage: 1, totalTasks: 47 }

POST /tasks — Request
{ "title": "Fix login bug", "description": "JWT expiry issue", "status": "Pending" }
POST /tasks — Response (201)
{ "success": true, "task": { "_id": "...", "title": "Fix login bug", ... } }

⚙️ Local Setup Instructions
Prerequisites
•	Node.js v18+
•	MongoDB Atlas account (free tier works)
•	Git

Step 1 — Clone the Repository
git clone https://github.com/Aditya-Shukla4/Task-Manager-Assessment.git
cd Task-Manager-Assessment

Step 2 — Backend Setup
cd server
npm install
# Create .env file with the following variables:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_32_character_random_secret_key
AES_SECRET_KEY=your_32_character_aes_encryption_key
CLIENT_URL=http://localhost:5173
# Start server
npm run dev

Step 3 — Frontend Setup
cd ../client
npm install
# Create .env file:
VITE_API_URL=http://localhost:5000/api
VITE_AES_KEY=your_32_character_aes_encryption_key
# Start frontend
npm run dev

Frontend runs on: http://localhost:5173
Backend API runs on: http://localhost:5000

🚀 Deployment
Service	Platform	Configuration
Frontend	Vercel	Auto-deploy from GitHub main branch. vercel.json handles SPA routing.
Backend	Render	Web Service. All env vars set in Render dashboard. Free tier cold starts.
Database	MongoDB Atlas	Cloud cluster. IP whitelist set to 0.0.0.0/0 for Render compatibility.

Environment Variables (Production)
No secrets are hardcoded. All sensitive values are stored in platform environment variable dashboards:
•	Render dashboard holds: MONGO_URI, JWT_SECRET, AES_SECRET_KEY, CLIENT_URL
•	Vercel dashboard holds: VITE_API_URL, VITE_AES_KEY

📊 Assessment Criteria Mapping
Criteria	Weight	Implementation
Code Structure & Clean Architecture	20%	MVC pattern, separated routes/controllers/models, modular utilities
Authentication & Security	20%	JWT + HTTP-Only Cookies, AES-256 encryption, bcrypt, CORS, input validation
Database Design & Query Handling	15%	Mongoose schemas with validation, userId isolation, indexed queries
API Design & Error Handling	15%	RESTful endpoints, structured JSON responses, semantic HTTP status codes
Frontend Integration & UX	10%	React + Tailwind, AuthContext, protected routes, real-time filters
Deployment & DevOps	10%	Vercel + Render, GitHub source, env vars, SPA routing fix
Documentation & Clarity	10%	This README — architecture, API docs, setup guide, security decisions

Built by Aditya Shukla  •  Full Stack Developer  •  24-Hour Assessment
