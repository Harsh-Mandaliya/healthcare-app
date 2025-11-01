# Healthcare Management Application

A full-stack modern healthcare management system designed to streamline patient care, hospital operations, doctor scheduling, billing, and medical records — built using **Node.js + Express (Backend)** and **React (Frontend)** with MongoDB as the database.

---

## Features

### Patient
- Register / Login / Forgot password
- View & update profile
- Book appointments with doctors
- View medical records
- Bill history viewing

### Doctor
- Doctor dashboard
- View patient list
- Manage appointments
- Update medical records
- Edit doctor profile

### Admin
- Manage users (patients / doctors)
- Hospital management
- Generate reports
- Doctor approval

### Billing
- Bill generation
- Patient bill history

---

##  Project Structure

healthcare-app/
├── backend/ → NodeJS REST API
└── frontend/ → React Client UI

##  Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React, Context API, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (Token Based) |
| Utils | Nodemailer, Cloudinary |

---

##  Roles

| Role | Access |
|----|-----|
| Patient | Book appointments, view records, profile |
| Doctor | Appointments, patient list, medical records |
| Admin | Manage hospitals, users, reports |

---

##  API Modules

| Module | Description |
|--------|-------------|
| Auth | Login / Register / Forgot Password |
| User | Patient Profile |
| Doctor | Doctor Management |
| Appointments | Book / Cancel / List |
| Hospitals | Hospital CRUD |
| Billing | Bill generation & history |
| Admin | Admin dashboards |

---

##  Setup Instructions

### Backend
```bash
cd backend
npm install
npm start


## Create .env:

MONGO_URI=
JWT_SECRET=
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_KEY=


## Frontend

cd frontend
npm install
npm start

## Future Enhancements

1. Payment gateway (Razorpay / Stripe)
2. AI based doctor recommendation
3. PDF bill & prescription generator
4. Push notifications (WebSockets)


All rights reserved — Private Project.
