
<img width="1911" height="888" alt="image" src="https://github.com/user-attachments/assets/7aa9b2d8-f981-4751-8b44-0c7b256772e0" />


# Campus Event Management System - Frontend

Modern frontend for the Campus Event Management System built using React, Vite, Tailwind CSS, and TypeScript.

## Live Demo

Frontend: https://cem-frontend-theta.vercel.app/

Backend API: https://campus-event-management-system-lhpe.onrender.com  
Swagger Docs: https://campus-event-management-system-lhpe.onrender.com/api-docs

---

# Features

## Authentication & Authorization
- Session-cookie based authentication
- Protected routes
- Role-Based Access Control (RBAC)
- Student / Admin / Super Admin dashboards

## Student Features
- Browse campus events
- Search and filter events
- Register/unregister for events
- View personal registrations
- Responsive dashboard with metrics

## Admin Features
- Create events
- Edit/manage events
- View registrations
- Publish/unpublish events
- Cancel events

## Super Admin Features
- User management
- Promote/demote users
- Delete users
- Platform-wide dashboard controls

## UI/UX
- Modern responsive UI
- Dashboard layouts
- Toast notifications
- Loading skeletons
- Empty states
- Responsive navbar/sidebar
- Pagination support

---

# Tech Stack

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- TanStack React Query
- React Hook Form
- Zod
- Lucide React Icons

## Backend
- Node.js
- Express.js
- PostgreSQL
- Session Authentication
- Swagger API Docs

---

# Folder Structure

```bash
src/
│
├── api/
├── components/
├── context/
├── layouts/
├── pages/
├── routes/
├── types/
├── hooks/
└── utils/
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/rajveerpathak1/CEM-Frontend.git
cd CEM-Frontend
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

---

# Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=https://campus-event-management-system-lhpe.onrender.com/api/v1
```

---

# Build for Production

```bash
npm run build
```

---

# Backend Repository

Backend Repository:  
https://github.com/rajveerpathak1/Campus-Event-Management-System

---

# API Integration

The frontend integrates with a deployed Express.js backend using:
- Session-based authentication
- Secure cookies
- RESTful APIs
- Role-based route protection

---

# Deployment

## Frontend
- Vercel

## Backend
- Render

---

# Future Improvements

- Email notifications
- Event poster uploads
- Analytics dashboard
- Docker support
- Redis caching
- CI/CD pipelines
- Dark mode
- Real-time notifications

---

# Author

Rajveer Pathak

GitHub: https://github.com/rajveerpathak1  
LinkedIn: https://www.linkedin.com/in/rajveerpathak/
