# QuizGenius

## Local Setup Instructions

### 1. Prerequisites

- Node.js installed.
- A MongoDB Atlas account and connection string.

### 2. Installation

**Frontend** (Root directory):

```bash
npm install
```

**Backend** (`server` directory):

```bash
cd server
npm install
```

### 3. Configuration

Open `server/server.js` and replace the `MONGO_URI` string with your actual MongoDB connection string.

### 4. Running the App

**Terminal 1 (Backend)**:

```bash
cd server
npm start
```

**Terminal 2 (Frontend)**:

```bash
npm run dev
```

Open your browser to the URL shown in Terminal 2 (usually `http://localhost:5173`).

### 5. Credentials

- **Admin Password**: `admin047`
- **Student**: Create a new account on the login page.
