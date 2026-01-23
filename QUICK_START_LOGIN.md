# Quick Start - How to Login to LumiScape

## Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd /Users/macos/Desktop/LumiScape-Frontend/backend
npm install  # If not already installed
npm run dev
```

The backend should start on `http://localhost:5000`

## Step 2: Create Your First User Account

You need to create a user account first. You have two options:

### Option A: Using the Registration API (Recommended)

Open another terminal and run:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@lumiscape.com",
    "password": "password123",
    "role": "super-admin"
  }'
```

Or use Postman/Insomnia to send a POST request to:
- **URL**: `http://localhost:5000/api/auth/register`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Admin User",
  "email": "admin@lumiscape.com",
  "password": "password123",
  "role": "super-admin"
}
```

### Option B: Using MongoDB Directly

1. Connect to MongoDB:
```bash
mongosh
```

2. Switch to database:
```javascript
use lumiscape
```

3. Create user (password will be hashed automatically when you login first time, or use bcrypt to hash it):
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@lumiscape.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "super-admin",
  status: "Active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Step 3: Start the Frontend

Open a new terminal and run:

```bash
cd /Users/macos/Desktop/LumiScape-Frontend
npm run dev
```

The frontend should start on `http://localhost:5173` (or another port)

## Step 4: Login

1. Open your browser and go to: `http://localhost:5173/login`

2. Enter your credentials:
   - **Email**: `admin@lumiscape.com` (or the email you registered)
   - **Password**: `password123` (or the password you set)

3. Click "Login"

4. You should be redirected to the dashboard!

## Available User Roles

You can create users with different roles:

- **super-admin**: Full system access
- **admin**: Administrative access (limited)
- **enterprise**: Enterprise user access
- **end-user**: Regular user access
- **customer-care**: Support staff access

## Troubleshooting

### Backend not starting?
- Make sure MongoDB is running: `brew services start mongodb-community` (macOS)
- Check if port 5000 is available
- Verify `.env` file exists in `backend/` directory

### Frontend not connecting?
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify `VITE_API_URL` in frontend `.env` is set to `http://localhost:5000/api`

### Login fails?
- Verify user exists in database
- Check backend logs for errors
- Make sure password is correct
- Verify user status is "Active" (not "Archived" or "Inactive")

### Can't create user?
- Make sure MongoDB is running and connected
- Check backend logs for errors
- Verify email is unique (not already registered)
