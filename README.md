# ReThread - Online Thrift Store

A simple full-stack application for managing pre-owned item exchange (buy/sell/donate).

## Tech Stack

- **Frontend**: React.js with React Router, Vite
- **Backend**: Node.js + Express
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT

## Project Structure

```
ReThread/
├── backend/
│   ├── routes/
│   │   └── auth.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Login.css
    │   │   ├── Signup.jsx
    │   │   └── Signup.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
DATABASE_URL="mysql://user:password@localhost:3306/rethread"
JWT_SECRET="your-secret-key-change-this-in-production"
```

4. Update the `DATABASE_URL` with your MySQL credentials:
   - Replace `user` with your MySQL username
   - Replace `password` with your MySQL password
   - Replace `localhost:3306` if your MySQL is on a different host/port
   - Replace `rethread` with your database name (or create a new database)

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate
```

7. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ email, password, name, role? }`
  - Role is optional (defaults to "buyer")

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

## Features Implemented

- ✅ User registration with email, password, name, and role
- ✅ User login with email and password
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive UI with CSS

## Next Steps

- Dashboard page
- Item listings
- User profile
- Item CRUD operations
- Wishlist functionality
- Search and filtering

