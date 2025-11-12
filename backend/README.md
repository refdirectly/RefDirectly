# ReferUs Backend

Professional authentication backend with MongoDB and JWT.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run development server:
```bash
npm run dev
```

Server will run on http://localhost:3001

## API Endpoints

### Authentication

**POST /api/auth/register**
- Register new user
- Body: `{ name, email, password }`
- Returns: `{ success, token, user }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ success, token, user }`

**GET /api/auth/me**
- Get current user
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success, user }`

## Features

- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ MongoDB integration
