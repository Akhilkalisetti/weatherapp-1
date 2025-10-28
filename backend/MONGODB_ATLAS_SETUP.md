# MongoDB Atlas Setup Guide

This document explains how to set up MongoDB Atlas and connect your forms to the database.

## Overview

This application uses MongoDB Atlas for data storage. Each form in the application has a corresponding MongoDB collection with full CRUD operations (Create, Read, Update, Delete, Search).

## Database Collections

### 1. **Users Collection**
- **Purpose**: Stores user authentication data
- **Model**: `User.js`
- **Operations**:
  - Create (Register)
  - Read (Login, Get user)
  - Update (User profile updates)
  - Delete (Account deletion)

### 2. **Memories Collection**
- **Purpose**: Stores traveler memories and photos
- **Model**: `Memory.js`
- **API Routes**: `/api/memories`
- **CRUD Operations**:
  - **Create**: POST `/api/memories`
  - **Read**: GET `/api/memories` (with search query support)
  - **Update**: PUT `/api/memories/:id`
  - **Delete**: DELETE `/api/memories/:id`
  - **Search**: GET `/api/memories?search=query`

### 3. **WeatherAbsence Collection**
- **Purpose**: Stores weather-related absence requests
- **Model**: `WeatherAbsence.js`
- **API Routes**: `/api/weather/absence`
- **CRUD Operations**:
  - **Create**: POST `/api/weather/absence`
  - **Read**: GET `/api/weather/absence` (admin) or GET `/api/weather/absence/me` (user's own)
  - **Update**: PUT `/api/weather/absence/:id` (admin only)
  - **Delete**: DELETE `/api/weather/absence/:id`
  - **Search**: GET `/api/weather/absence?search=query`

### 4. **WorkReports Collection**
- **Purpose**: Stores employee work status reports
- **Model**: `WorkReport.js`
- **API Routes**: `/api/weather/reports`
- **CRUD Operations**:
  - **Create**: POST `/api/weather/reports`
  - **Read**: GET `/api/weather/reports` (with search query support)
  - **Update**: PUT `/api/weather/reports/:id`
  - **Delete**: DELETE `/api/weather/reports/:id`
  - **Search**: GET `/api/weather/reports?search=query`

## Setting Up MongoDB Atlas

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the FREE tier)

### Step 2: Configure Database Access
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `admin` (or your preferred username)
5. Generate a secure password (save this!)
6. Set permissions to **Read and write to any database**
7. Click **Add User**

### Step 3: Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (or add specific IPs for production)
4. Click **Confirm**

### Step 4: Get Connection String
1. Click **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `weatherapp`)

Example:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/weatherapp?retryWrites=true&w=majority
```

### Step 5: Configure Environment Variables
1. Copy `env.template` to `.env` in the `server` directory
2. Add your MongoDB connection string:
```env
MONGO_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/weatherapp?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here_at_least_32_characters_long
PORT=5000
NODE_ENV=development
```

### Step 6: Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it to your `.env` file.

## Testing the Connection

### Start the Server
```bash
cd server
npm start
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on port 5000
📍 API endpoint: http://localhost:5000/api
```

### Test API Endpoints

#### Test Memories API
```bash
# Create a memory (requires authentication)
curl -X POST http://localhost:5000/api/memories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Memory",
    "date": "2024-01-01",
    "description": "This is a test memory",
    "location": "Paris, France"
  }'

# Get all memories
curl http://localhost:5000/api/memories \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search memories
curl "http://localhost:5000/api/memories?search=Paris" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update memory
curl -X PUT http://localhost:5000/api/memories/MEMORY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Updated Title"}'

# Delete memory
curl -X DELETE http://localhost:5000/api/memories/MEMORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test Weather Absence API
```bash
# Create absence request
curl -X POST http://localhost:5000/api/weather/absence \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employeeName": "John Doe",
    "employeeId": "EMP001",
    "location": "New York, NY",
    "description": "Heavy rain preventing travel"
  }'

# Get all absence requests (admin only)
curl http://localhost:5000/api/weather/absence \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Search absence requests
curl "http://localhost:5000/api/weather/absence?search=New York" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Test Work Reports API
```bash
# Create work report
curl -X POST http://localhost:5000/api/weather/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2024-01-01",
    "project": "Website Redesign",
    "tasks": "Implemented new features",
    "location": "home",
    "status": "in-progress"
  }'

# Get work reports
curl http://localhost:5000/api/weather/reports \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update work report
curl -X PUT http://localhost:5000/api/weather/reports/REPORT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "completed"}'

# Delete work report
curl -X DELETE http://localhost:5000/api/weather/reports/REPORT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Integration

The frontend uses the `api.js` service to connect to the backend. Make sure:

1. Set the API URL in your `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

2. The frontend will automatically use these endpoints through the API service

## Database Tables/Collections Overview

### Users Table
```
- _id: ObjectId (auto-generated)
- email: String (unique, indexed)
- password: String (hashed)
- name: String
- role: String (traveler, employee, admin)
- avatar: String
- createdAt: Date
```

### Memories Table
```
- _id: ObjectId (auto-generated)
- userId: ObjectId (reference to User)
- title: String
- date: String
- location: String
- description: String
- images: [String] (base64 or URLs)
- createdAt: Date
- updatedAt: Date
```

### WeatherAbsence Table
```
- _id: ObjectId (auto-generated)
- userId: ObjectId (reference to User)
- employeeName: String
- employeeId: String
- location: String
- description: String
- verificationResult: Object
  - isVerified: Boolean
  - weatherData: Object
- status: String (pending, approved, rejected)
- comment: String
- submittedAt: Date
- updatedAt: Date
```

### WorkReports Table
```
- _id: ObjectId (auto-generated)
- userId: ObjectId (reference to User)
- date: String
- project: String
- tasks: String
- location: String (home, office)
- status: String (completed, in-progress, pending)
- createdAt: Date
```

## Troubleshooting

### Connection Issues
- Make sure your IP is whitelisted in Network Access
- Verify your connection string is correct
- Check if the password is properly URL-encoded
- Ensure the database name matches in your connection string

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check if the token is being sent in Authorization header
- Ensure user is logged in before making API calls

### API Errors
- Check server logs for detailed error messages
- Verify your MongoDB cluster is running
- Ensure all required fields are provided in requests

## Additional Resources
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express API Best Practices](https://expressjs.com/en/guide/routing.html)

