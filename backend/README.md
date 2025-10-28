# Backend Server - Weather App

This is the Node.js backend server for the Weather/Travel Management App with MongoDB Atlas integration.

## Features

- **User Authentication**: JWT-based authentication with role management (Traveler, Employee, Admin)
- **Memory Management**: CRUD operations for travel memories
- **Work Reports**: Employee work status reporting
- **Weather Absence Requests**: Weather-related absence request system
- **RESTful API**: Clean API structure with proper error handling

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/weatherapp?retryWrites=true&w=majority

# JWT Secret Key (generate a random string)
JWT_SECRET=your_very_secret_jwt_key_here_make_it_long_and_random

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" and choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Add your IP address to the whitelist

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Memories
- `GET /api/memories` - Get all user's memories
- `POST /api/memories` - Create a new memory
- `PUT /api/memories/:id` - Update a memory
- `DELETE /api/memories/:id` - Delete a memory

### Weather Absence
- `GET /api/weather/absence` - Get all absence requests (admin)
- `POST /api/weather/absence` - Create absence request
- `PUT /api/weather/absence/:id` - Update request status (admin)

### Work Reports
- `GET /api/weather/reports` - Get work reports
- `POST /api/weather/reports` - Create work report
- `DELETE /api/weather/reports/:id` - Delete work report

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID

## Database Models

### User
- email, password, name, role, avatar, createdAt

### Memory
- userId, title, date, location, description, images[], createdAt, updatedAt

### WeatherAbsence
- userId, employeeName, employeeId, location, description, verificationResult, status, comment, submittedAt, updatedAt

### WorkReport
- userId, date, project, tasks, location, status, createdAt

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control (RBAC)
- Password requirements: minimum 8 characters
- Token expiration: 7 days

## Error Handling

All errors return in the format:
```json
{
  "error": "Error message"
}
```

## Development

The server uses:
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

