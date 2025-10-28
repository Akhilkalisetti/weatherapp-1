# Debug Guide: Memory Storage Not Working in MongoDB

## Problem
When creating a memory from the frontend form, it shows in the UI but doesn't save to MongoDB.

## How to Debug

### Step 1: Check Authentication
1. Open browser console (F12)
2. Look for the token in localStorage:
   ```javascript
   localStorage.getItem('token')
   ```
3. If token is null/undefined, you need to **login first**
4. Login with: `traveler@test.com` / `traveler123`

### Step 2: Check Console Logs
When creating a memory, you should see:
- `Creating memory with data:` - Shows the data being sent
- `API Request:` - Shows the URL and headers
- `API Response status:` - Shows if backend received the request

### Step 3: Check Backend Logs
In the backend terminal, you should see:
- `🔐 Auth header:` - Shows if authentication header is present
- `✅ Authenticated user:` - Shows which user is authenticated
- `📝 Creating memory for user:` - Shows who is creating the memory
- `✅ Memory saved successfully:` - Confirms memory was saved to MongoDB

### Step 4: Common Issues

#### Issue: "No token provided"
**Solution:** You're not logged in. Login first with the test account.

#### Issue: "Invalid token"
**Solution:** Token expired or wrong. Logout and login again.

#### Issue: "User not found"
**Solution:** The user doesn't exist in the database. Run:
```bash
cd backend
npm run seed-memories
```

#### Issue: Network error or CORS
**Solution:** Make sure backend is running on port 5000:
```bash
cd backend
npm start
```

## Test the Fix

1. **Login** with `traveler@test.com` / `traveler123`
2. **Open browser console** (F12)
3. **Create a memory** in the Memories tab
4. **Check logs**:
   - Frontend: Should show API request details
   - Backend: Should show authentication and memory creation
5. **Verify in MongoDB**:
   ```bash
   cd backend
   node -e "const mongoose=require('mongoose');const Memory=require('./models/Memory');require('dotenv').config();mongoose.connect(process.env.MONGO_URI).then(async()=>{const count=await Memory.countDocuments();console.log('Memories in DB:',count);const latest=await Memory.find().sort({createdAt:-1}).limit(1);console.log('Latest memory:',latest[0]?.title);process.exit(0);});"
   ```

## Quick Test Commands

### Test API connection:
```bash
# Should return: {"status":"OK","message":"Server is running"}
curl http://localhost:5000/api/health
```

### Test authentication:
```javascript
// In browser console
fetch('http://localhost:5000/api/memories', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

## Current Status
✅ Backend has logging for debugging
✅ Frontend has logging for debugging
✅ Authentication is working
✅ Data should now save to MongoDB

## Next Steps
1. Try creating a memory
2. Check both frontend and backend console logs
3. Share the error messages if it still doesn't work

