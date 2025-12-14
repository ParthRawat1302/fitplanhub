# FitPlanHub – Trainers & Users Platform

FitPlanHub is a demo full-stack app where certified trainers create fitness plans and users purchase and follow these plans.

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT Auth
- Frontend: React (Vite)
- Auth: Password hashing (bcryptjs) + JWT tokens

## Features

### Authentication

- Signup/Login for both Users and Trainers
- JWT token-based auth
- Password hashing with bcrypt

### Trainers

- Create, update, delete their own fitness plans
- Plan fields: Title, Description, Price, Duration (days)

### Users

- View all plans with previews (title, trainer, price, duration)
- Subscribe to plans (simulated payment, no real gateway)
- Only subscribed users see full plan details
- Follow/unfollow trainers
- View list of followed trainers
- Personalized feed:
  - Plans by followed trainers
  - Plans user has purchased

## Project Structure

See folder layout:

- `backend/` – Express API
- `frontend/` – React UI

---

## Backend Setup

    ```bash
    cd backend
    cp .env.example .env
    # edit .env with your values

    npm install
    npm run dev

Backend defaults to http://localhost:5000.

Important Scripts
    npm run dev – Start dev server with nodemon
    npm start – Start production server

Environment Variables
    PORT – Port (default 5000)
    MONGODB_URI – MongoDB connection string
    JWT_SECRET – Secret key for JWT

Frontend Setup
    cd frontend
    cp .env.example .env
    # set VITE_API_BASE_URL, e.g. http://localhost:5000/api

    npm install
    npm run dev

Frontend runs on Vite default (e.g. http://localhost:5173).


Usage Flow
    Open frontend in browser.
    Sign up as a trainer, login, and create some plans.
    Sign up as a user, login.
    From landing page, see all plan previews.
    Click a plan → if not subscribed:
    Only preview visible
    Use "Subscribe" button to simulate payment.
    After subscription, full plan description is visible.
    From trainer profile:
    Follow/unfollow trainers.
    Open "My Feed":
    View plans created by followed trainers.
    View plans you have purchased.


API Overview
Base URL: /api
    POST /auth/signup – Signup as user/trainer
    POST /auth/login – Login
    GET /auth/me – Current user
    GET /plans – List all plans (preview)
    POST /plans – [Trainer] Create plan
    PUT /plans/:id – [Trainer-owner] Update plan
    DELETE /plans/:id – [Trainer-owner] Delete plan
    GET /plans/:id – Plan details (preview vs full)
    POST /subscriptions/:planId – Subscribe (simulate payment)
    GET /subscriptions/my – My subscriptions
    GET /trainers – List all trainers
    POST /trainers/:trainerId/follow – Follow trainer
    DELETE /trainers/:trainerId/follow – Unfollow trainer
    GET /trainers/following – Trainers I follow
    GET /trainers/:trainerId/profile – Trainer details + plans + follow status
    GET /feed – Personalized feed



