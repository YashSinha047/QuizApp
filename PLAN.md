# Project Plan: QuizGenius (MERN Stack)

## 1. Scope & Objectives

Build a Quiz Management System using the MERN stack (MongoDB, Express, React, Node.js).

- **Role-Based Access**:
  - **Admin**: Authenticates via fixed password (`admin047`). Can create/edit/delete quizzes manually.
  - **Student**: Authenticates via Database credentials. Can take quizzes and view history.
- **No AI**: All content is manually generated.

## 2. Architecture

### Frontend (React.js)

- **Language**: JavaScript (ES6+).
- **Routing**: React Router v6.
- **State**: Context API (`AuthContext`) storing JWT in `localStorage`.
- **Styling**: Tailwind CSS.

### Backend (Node.js/Express)

- **Auth**: JSON Web Tokens (JWT).
  - Admin route checks specific password.
  - Student route checks MongoDB User collection.
- **Database**: MongoDB (Atlas).
- **API Structure**:
  - `POST /api/auth/login`: Handles both Admin and Student login.
  - `POST /api/auth/register`: Student registration.
  - `GET/POST/PUT/DELETE /api/quizzes`: Quiz management.
  - `GET/POST /api/attempts`: Score tracking.

## 3. Data Models (Schemas)

- **User**: `{ username, password (hashed ideally, plaintext for now per prompt flow) }`
- **Quiz**:
  - `title`, `description`, `createdAt`
  - `questions`: Array of `{ text, type, options, correctAnswer, points }`
- **Attempt**: `{ userId, quizId, score, maxScore, answers, timestamp }`

## 4. Implementation Steps

1.  **Backend Setup**: Create server, connect to Mongo, define models.
2.  **Auth Implementation**: JWT generation and verification middleware.
3.  **Frontend Migration**: Convert TSX to JSX, remove types.
4.  **API Service**: Replace `storage.ts` with `axios` or `fetch` calls to backend.
