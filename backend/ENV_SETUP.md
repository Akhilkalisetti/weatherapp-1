# Environment Setup Guide

## Quick Start

### 1. Create `.env` file

In the `server/` directory, create a `.env` file with the following content:

```env
# MongoDB Atlas Connection
MONGO_URI=your_connection_string_here

# JWT Secret Key (use a long random string)
JWT_SECRET=your_jwt_secret_key_here_at_least_32_characters_long

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 2. Getting MongoDB Atlas Connection String

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Click "Connect" button
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your actual password
8. Replace `<dbname>` with `weatherapp`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/weatherapp?retryWrites=true&w=majority
```

### 3. Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value.

### 4. Setup Database User

1. In MongoDB Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password
5. Give user "Read and write to any database" permission
6. Use these credentials in your connection string

### 5. Network Access

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Or add your specific IP address

### 6. Start the Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on port 5000
📍 API endpoint: http://localhost:5000/api
```

## Testing the API

### Test with curl

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "traveler"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "traveler"
  }'
```

## Troubleshooting

### Connection Issues

**Problem**: "Server selection timed out"  
**Solution**: Check your IP is whitelisted in MongoDB Atlas

**Problem**: "Authentication failed"  
**Solution**: Verify your database username and password

**Problem**: "Host not found"  
**Solution**: Check your connection string is correct

### Port Already in Use

**Problem**: "Port 5000 already in use"  
**Solution**: Change PORT in .env to another port (e.g., 5001)

### Missing Dependencies

Run:
```bash
npm install
```

## Production Deployment

For production, make sure to:
1. Set `NODE_ENV=production`
2. Use a strong, random `JWT_SECRET`
3. Enable HTTPS
4. Use proper database credentials
5. Set up proper logging
6. Configure CORS properly
7. Use environment-specific MongoDB URLs

