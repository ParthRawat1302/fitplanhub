FitPlanHub – Trainers & Users Platform

FitPlanHub is a small full-stack project I built to practice how real fitness apps work.
Here certified trainers can upload their fitness plans and normal users can buy and follow them.
It has login system, trainer dashboard, user feed and even simulated payment just to feel real.

Tech Stack Used

Backend: Node.js + Express + MongoDB (Mongoose)
Frontend: React (Vite build)
Auth: JWT token and password hashing using bcryptjs

Main Features
🔐 Authentication

Separate signup / login for trainers and users

Passwords saved after hashing

Token based login system (JWT)

🧑‍🏫 Trainers

Create / edit / delete their own fitness plans

Each plan has title, description, price, duration (in days)

💪 Users

See all available plans in preview mode

Can “subscribe” to plan (fake payment)

Once subscribed they get full access to plan content

Follow and unfollow any trainer

View trainers they follow

Get a personal feed that shows

Plans from followed trainers

Plans already purchased

Folder Structure
fitplanhub/
 ├── backend/   → Express + MongoDB APIs
 └── frontend/  → React + Tailwind UI

Backend Setup
cd backend
cp .env.example .env
# open .env and fill your values
npm install
npm run dev


Backend runs at: http://localhost:5000

Important Scripts

npm run dev – start dev mode with nodemon

npm start – normal run

Env Variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=anything_secure_here

Frontend Setup
cd frontend
cp .env.example .env
# in .env put:
# VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev


Frontend runs at: http://localhost:5173

How To Use

Open the frontend in browser.

Trainer: signup → login → open dashboard → create few plans.

User: signup → login → go to home page → see plans in preview.

Click on a plan → press Subscribe → now full plan visible.

Open trainer profile → follow/unfollow trainer.

Open My Feed → see plans from followed trainers and purchased ones.

API Routes Overview

Base URL: /api

Method	Route	Description
POST	/auth/signup	Signup as user or trainer
POST	/auth/login	Login existing account
GET	/auth/me	Current user info
GET	/plans	All plans (preview)
POST	/plans	Trainer create plan
PUT	/plans/:id	Trainer update plan
DELETE	/plans/:id	Trainer delete plan
GET	/plans/:id	Plan details (preview / full)
POST	/subscriptions/:planId	Simulate plan purchase
GET	/subscriptions/my	User’s subscriptions
GET	/trainers	All trainers list
POST	/trainers/:trainerId/follow	Follow trainer
DELETE	/trainers/:trainerId/follow	Unfollow trainer
GET	/trainers/following	Trainers I follow
GET	/trainers/:trainerId/profile	Trainer profile + plans
GET	/feed	Personalized feed
Postman Collection

A ready Postman collection is included at:
backend/postman/FitPlanHub_API_Collection.json

Collection Example:

FitPlanHub_API_Collection.json
└── Auth
    ├── Signup Trainer
    ├── Signup User
    ├── Login Trainer
    └── Login User
└── Plans
    ├── Get All Plans
    ├── Create Plan
    ├── Update Plan
    ├── Delete Plan
└── Subscriptions
    ├── Subscribe to Plan
    ├── My Subscriptions
└── Trainers
    ├── All Trainers
    ├── Follow Trainer
    ├── Unfollow Trainer
    ├── Trainer Profile
└── Feed
    └── My Feed


To use it:

Open Postman

Click Import → File

Select this JSON file

Set variable {{base_url}} = http://localhost:5000/api

Sample Users (for quick demo)
Role	Email	Password
Trainer	trainer@test.com
	123456
User	user@test.com
	123456
What I Learned / Notes

I mostly made this to learn how frontend and backend talk using REST APIs.
Main challenge was connecting React with Express using proper JWT flow and keeping separate roles.
Tailwind made the frontend look much better after I setup configs correctly.
If any trainer or user part doesn’t load, mostly it’s .env issue or backend not running.
I also use AI to make this so that i make things fast
