# LumiScape Frontend - Energy Management System

A comprehensive energy management system built with React and Node.js.

## Features

- **User Authentication**: JWT-based authentication system
- **User Management**: Manage admins, enterprise users, and end users
- **Supplier Management**: Complete supplier CRUD operations
- **Device Management**: Track and manage smart devices
- **Ticket System**: Handle complaints and support tickets
- **Subscription Management**: Manage user subscriptions and plans
- **Analytics Dashboard**: System-wide analytics and insights
- **Reports**: Generate and export custom reports
- **Chat System**: Internal messaging system
- **Role Management**: Define custom roles with permissions
- **Help Center**: FAQs, articles, and troubleshooting guides

## Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Axios
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
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
MONGODB_URI=mongodb://localhost:27017/lumiscape
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services
```

5. Run the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the root directory (if not already there):
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Default User Accounts

After setting up the backend, you can create a user account by:

1. Using the registration endpoint:
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@lumiscape.com",
  "password": "password123",
  "role": "super-admin"
}
```

2. Or using MongoDB directly to insert a user with a hashed password

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/reset-password` - Request password reset

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Super-admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Super-admin only)

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create supplier (Admin only)
- `PUT /api/suppliers/:id` - Update supplier (Admin only)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin only)

### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Create device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device (Admin only)
- `GET /api/devices/stats/overview` - Get device statistics

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/stats` - Get ticket statistics
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `PUT /api/tickets/:id/assign` - Assign ticket (Admin only)
- `DELETE /api/tickets/:id` - Delete ticket (Super-admin only)

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/revenue` - Get revenue analytics (Admin only)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics (Admin only)
- `GET /api/analytics/system` - Get system analytics (Admin only)

## Project Structure

```
LumiScape-Frontend/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Server entry point
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React context providers
│   ├── services/        # API service functions
│   ├── dashboardScreens/ # Page components
│   └── App.jsx          # Main app component
└── package.json
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time (default: 7d)
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Notes

- All API routes (except login and register) require authentication via JWT token
- The token is automatically included in request headers via axios interceptors
- User roles: `super-admin`, `admin`, `enterprise`, `end-user`, `customer-care`
- Password hashing is done automatically via bcryptjs
- MongoDB connection is handled automatically on server start

## Troubleshooting

1. **MongoDB connection error**: Make sure MongoDB is running and the connection string is correct
2. **CORS errors**: The backend has CORS enabled. Check if the frontend URL matches
3. **JWT token errors**: Ensure JWT_SECRET is set in backend .env file
4. **Port conflicts**: Change PORT in backend .env if 5000 is already in use

## License

ISC
