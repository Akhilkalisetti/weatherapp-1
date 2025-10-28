# Backend Overview - Weather App

## 📁 Project Structure

```
server/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── setup.js                  # Auto-setup script
├── .env                      # Environment variables (create this)
├── .gitignore                # Git ignore rules
├── README.md                 # Main documentation
├── ENV_SETUP.md             # Environment setup guide
│
├── models/                   # Database models
│   ├── User.js              # User model with authentication
│   ├── Memory.js            # Travel memory model
│   ├── WeatherAbsence.js    # Weather absence request model
│   └── WorkReport.js        # Employee work report model
│
├── routes/                   # API routes
│   ├── auth.js              # Authentication routes
│   ├── memories.js          # Memory CRUD operations
│   ├── users.js             # User management
│   └── weather.js           # Weather & work reports
│
└── middleware/              # Middleware functions
    └── auth.js               # JWT authentication middleware
```

## 🚀 Quick Start

### Option 1: Automatic Setup
```bash
cd server
npm run setup
```

### Option 2: Manual Setup
1. Create `.env` file in `server/` directory
2. Add your MongoDB Atlas connection string
3. See `ENV_SETUP.md` for detailed instructions

### Start the Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user info

### Memories (`/api/memories`)
- `GET /` - Get all user's memories
- `POST /` - Create new memory
- `PUT /:id` - Update memory
- `DELETE /:id` - Delete memory

### Weather & Work (`/api/weather`)
- `GET /absence` - Get all absence requests (admin)
- `POST /absence` - Create absence request
- `PUT /absence/:id` - Update request status
- `GET /reports` - Get work reports
- `POST /reports` - Create work report
- `DELETE /reports/:id` - Delete work report

### Users (`/api/users`)
- `GET /` - Get all users (admin)
- `GET /:id` - Get user by ID

## 🔐 Authentication

All protected routes require a JWT token in the header:
```
Authorization: Bearer <token>
```

Tokens expire after 7 days.

## 🗄️ Database Models

### User
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: ['traveler', 'employee', 'admin'],
  avatar: String,
  createdAt: Date
}
```

### Memory
```javascript
{
  userId: ObjectId (required),
  title: String (required),
  date: String (required),
  location: String,
  description: String (required),
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### WeatherAbsence
```javascript
{
  userId: ObjectId (required),
  employeeName: String (required),
  employeeId: String (required),
  location: String (required),
  description: String (required),
  verificationResult: Object,
  status: ['pending', 'approved', 'rejected'],
  comment: String,
  submittedAt: Date,
  updatedAt: Date
}
```

### WorkReport
```javascript
{
  userId: ObjectId (required),
  date: String (required),
  project: String (required),
  tasks: String (required),
  location: ['home', 'office'],
  status: ['completed', 'in-progress', 'pending'],
  createdAt: Date
}
```

## 🛡️ Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Role-Based Access Control**: Traveler, Employee, Admin
4. **MongoDB Atlas**: Cloud-hosted database
5. **Environment Variables**: Sensitive data protection
6. **Input Validation**: Data sanitization
7. **Error Handling**: Proper error responses

## 📊 Features

✅ User registration and login  
✅ JWT-based authentication  
✅ Role-based access control  
✅ Travel memory management  
✅ Work report system  
✅ Weather absence requests  
✅ Employee management  
✅ Admin dashboard support  
✅ Image storage (base64)  
✅ RESTful API design  

## 🔧 Configuration

### Required Environment Variables
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### MongoDB Atlas Setup
1. Sign up at https://cloud.mongodb.com/
2. Create a free cluster
3. Get connection string
4. Add to `.env` file
5. Whitelist IP address

## 📝 Next Steps

1. ✅ Backend created
2. ✅ MongoDB models defined
3. ✅ API routes implemented
4. ⏳ Connect frontend to backend
5. ⏳ Update AuthContext to use API
6. ⏳ Test all endpoints
7. ⏳ Deploy to production

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your MONGO_URI in `.env`
- Verify IP is whitelisted in Atlas
- Check username/password

### "Invalid token"
- Token may have expired
- Check JWT_SECRET matches
- Verify token format in headers

### "Port already in use"
- Change PORT in `.env`
- Or kill process using the port

## 📚 Documentation

- `README.md` - Main documentation
- `ENV_SETUP.md` - Environment setup guide
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/

