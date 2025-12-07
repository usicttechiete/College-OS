# College OS Backend

Express.js backend for the College Lost & Found platform with Supabase authentication.

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (create one at [supabase.com](https://supabase.com))

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)
   - `SUPABASE_JWT_SECRET` - Your Supabase JWT secret

3. **Run database migrations**
   
   Execute the SQL in `db/migrations/001_create_profiles_table.sql` in your Supabase SQL editor.

4. **Start the server**
   ```bash
   npm run dev    # Development with auto-reload
   npm start      # Production
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/logout` | Logout current user | Yes |
| POST | `/auth/refresh` | Refresh access token | No |
| GET | `/auth/me` | Get current user profile | Yes |
| PATCH | `/auth/profile` | Update user profile | Yes |
| POST | `/auth/forgot-password` | Send password reset email | No |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.js          # Environment configuration
│   ├── lib/
│   │   └── supabase.js     # Supabase client setup
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── routes/
│   │   └── auth.js         # Auth route handlers
│   └── index.js            # Express app entry point
├── db/
│   ├── migrations/         # SQL migration files
│   └── seed.sql            # Development seed data
├── .env.example            # Environment template
└── package.json
```

## Authentication Flow

1. **Signup**: User registers via `/auth/signup` → Supabase creates auth user → Database trigger creates profile
2. **Login**: User authenticates via `/auth/login` → Returns JWT access token + refresh token
3. **Protected Routes**: Include `Authorization: Bearer <token>` header → Middleware validates JWT
4. **Token Refresh**: When access token expires, use `/auth/refresh` with refresh token

## Security Notes

- Never commit `.env` file
- Service role key should only be used server-side
- All user-facing routes use anon key with RLS policies
- JWT tokens expire after 1 hour (configurable in Supabase dashboard)
