# 🚀 Task Management System (Assessment)

A production-ready Full-Stack Task Management application built with **React**, **Node.js**, **Express**, and **MongoDB**. This project features high-security implementations, including AES-256 payload encryption and JWT-based authentication via HTTP-only cookies.

## 🔗 Live Demo
- **Frontend (Vercel):** https://task-manager-assessment-eight.vercel.app/
- **Backend API (Render):** https://task-manager-assessment-ramf.onrender.com

## ✨ Key Features
- **Security First:**
  - **AES-256 Encryption:** Sensitive response data is encrypted on the server and decrypted on the client.
  - **HTTP-Only Cookies:** JWT tokens are stored securely to prevent XSS attacks.
  - **CORS Configuration:** Strictly defined origins for production security.
- **Task Management:** Complete CRUD functionality with pagination, title search, and status filtering.
- **Modern UI:** Responsive design built with Tailwind CSS, featuring glass-morphism and intuitive status toggles.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express, Mongoose, Bcrypt.js, Crypto-JS.
- **Database:** MongoDB Atlas (Cloud).

## ⚙️ Environment Variables
To run this project locally, create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_32_char_random_secret
AES_SECRET_KEY=your_32_char_aes_key
