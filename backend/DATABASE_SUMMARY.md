# MongoDB Database Summary

## Data Stored in MongoDB

Your weatherapp MongoDB database now contains the following data:

### ✅ Memories Collection
- **8 travel memories** stored
- Fields: title, date, location, description, images
- User: traveler@test.com

### ✅ Weather Absence Requests Collection
- **4 absence requests** stored
- Fields: employeeName, employeeId, location, description, verificationResult (with weather data and alerts), status, comment
- Users: John Smith, Emma Johnson, Michael Brown
- Statuses: approved, pending

### ✅ Work Reports Collection
- **6 work reports** stored
- Fields: date, project, tasks, location (home/office), status
- Projects: Website Redesign, Mobile App Development, Database Optimization, Security Audit, API Documentation
- Statuses: completed, in-progress, pending

### ✅ Users Collection
- **traveler@test.com** (Role: traveler) - Password: traveler123
- **employee@test.com** (Role: employee) - Password: employee123
- **admin@test.com** (Role: admin) - Password: admin123

---

## Collections in MongoDB

### 1. memories
- Stored in MongoDB ✅
- Connected to backend API ✅
- Seeded with 8 sample memories ✅

### 2. weatherabsences (WeatherAbsence model)
- Stored in MongoDB ✅
- Connected to backend API ✅
- Seeded with 4 sample absence requests ✅

### 3. workreports (WorkReport model)
- Stored in MongoDB ✅
- Connected to backend API ✅
- Seeded with 6 sample work reports ✅

### 4. users (User model)
- Authentication users stored ✅
- Roles: traveler, employee, admin ✅

---

## API Endpoints

### Memories
- `GET /api/memories` - Get all memories for logged-in user
- `POST /api/memories` - Create a new memory
- `PUT /api/memories/:id` - Update a memory
- `DELETE /api/memories/:id` - Delete a memory

### Weather Absence
- `GET /api/weather/absence` - Get all absence requests (admin only)
- `GET /api/weather/absence/me` - Get user's own absence requests
- `POST /api/weather/absence` - Create absence request
- `PUT /api/weather/absence/:id` - Update absence request (admin only)
- `DELETE /api/weather/absence/:id` - Delete absence request

### Work Reports
- `GET /api/weather/reports` - Get all work reports
- `POST /api/weather/reports` - Create work report
- `PUT /api/weather/reports/:id` - Update work report
- `DELETE /api/weather/reports/:id` - Delete work report

---

## How to Seed Data

### Seed Memories (for Travelers)
```bash
cd backend
npm run seed-memories
```

### Seed Employee Data (Weather Absence + Work Reports)
```bash
cd backend
npm run seed-employee
```

---

## Test Accounts

### Traveler
- Email: `traveler@test.com`
- Password: `traveler123`
- Can: View memories, create/delete memories

### Employee
- Email: `employee@test.com`
- Password: `employee123`
- Can: View work reports, create work reports, submit weather absence requests

### Admin
- Email: `admin@test.com`
- Password: `admin123`
- Can: View all absence requests, approve/reject requests, manage all data

---

## Data Verification

All data is being stored in MongoDB Atlas (or local MongoDB if configured).

To verify the data in MongoDB:
```bash
# Count documents in each collection
mongosh your_connection_string
> use weatherapp
> db.memories.countDocuments()
> db.weatherabsences.countDocuments()
> db.workreports.countDocuments()
> db.users.countDocuments()
```

---

## Notes

- **Memories**: Used by travelers to store travel experiences
- **Weather Absence**: Used by employees to request absence due to bad weather
- **Work Reports**: Used by employees to log daily work activities
- All data requires authentication via JWT token
- All endpoints use role-based access control (RBAC)

