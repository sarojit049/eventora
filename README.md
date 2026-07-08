# Eventora - Full-Stack Event Booking Platform

A complete MERN stack event booking platform created for a competition capstone project.

## Features

- **User Authentication:** JWT-based login, registration, and role-based access control (Admin vs User).
- **Event Discovery:** Browse events by category, city, date, and price. Search and pagination included.
- **Booking System:** Atomic seat reservation, ticket quantity selection, and booking management.
- **Admin Dashboard:** Comprehensive dashboard for stats, revenue, recent bookings, and event CRUD.
- **Responsive UI:** Modern design with Tailwind CSS and Lucide icons.
- **Dockerized:** Fully containerized with Docker Compose for local development.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, TanStack Query, Axios.
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Joi, Swagger UI.
- **DevOps:** Docker, GitHub Actions (CI/CD).

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB
- Docker (optional, for containerized run)

### Local Development

1. **Install Dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Variables:**
   - Create `.env` in `backend/` from `backend/.env.example`.
   - Create `.env` in `frontend/` from `frontend/.env.example`.

3. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   *Optional: Seed database with `npm run seed`*

4. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Docker

To run the entire stack using Docker Compose:

```bash
docker-compose up --build
```
The frontend will be available at http://localhost:8080 and the backend API at http://localhost:5000.

## API Documentation

The Swagger UI API documentation is available at `http://localhost:5000/api-docs` when the backend is running.

## Testing

Run backend tests:
```bash
cd backend
npm test
```
