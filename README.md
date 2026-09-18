# Ganpati Management System - MERN Stack

## Requirements
- Node.js
- MongoDB Community Server or MongoDB Atlas
- VS Code

## Backend
```bash
cd backend
copy .env.example .env
npm install
npm run dev
```
Edit `.env` if required.

## Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Create Admin
Use Postman or Thunder Client:
POST http://localhost:5000/api/auth/setup
JSON body:
```json
{"username":"admin","password":"admin123"}
```
Then login from the frontend.
