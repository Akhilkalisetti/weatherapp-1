const mongoose = require('mongoose');
const WeatherAbsence = require('./models/WeatherAbsence');
const WorkReport = require('./models/WorkReport');
const User = require('./models/User');
require('dotenv').config();

const dummyAbsenceRequests = [
  {
    employeeName: "John Smith",
    employeeId: "EMP001",
    location: "New York, NY",
    description: "Severe snowstorm made it impossible to commute safely. Public transport was suspended.",
    verificationResult: {
      isVerified: true,
      weatherData: {
        temperature: -5,
        condition: "Heavy Snow",
        humidity: 85,
        windSpeed: 25,
        alerts: [
          {
            type: "Winter Storm Warning",
            message: "Heavy snowfall expected",
            time: "2024-01-15T06:00:00.000Z"
          }
        ]
      }
    },
    status: "approved",
    comment: "Weather verification confirmed. Request approved."
  },
  {
    employeeName: "John Smith",
    employeeId: "EMP001",
    location: "Boston, MA",
    description: "Extreme cold weather advisory with dangerously low temperatures.",
    verificationResult: {
      isVerified: true,
      weatherData: {
        temperature: -18,
        condition: "Extreme Cold",
        humidity: 70,
        windSpeed: 15,
        alerts: [
          {
            type: "Extreme Cold Warning",
            message: "Wind chill below -30°C",
            time: "2024-02-20T05:00:00.000Z"
          }
        ]
      }
    },
    status: "pending",
    comment: ""
  },
  {
    employeeName: "Emma Johnson",
    employeeId: "EMP002",
    location: "Los Angeles, CA",
    description: "Heavy rain and flooding in area. Major roads were closed.",
    verificationResult: {
      isVerified: true,
      weatherData: {
        temperature: 12,
        condition: "Heavy Rain",
        humidity: 95,
        windSpeed: 30,
        alerts: [
          {
            type: "Flash Flood Warning",
            message: "Heavy rainfall causing flooding",
            time: "2024-03-10T08:00:00.000Z"
          }
        ]
      }
    },
    status: "approved",
    comment: "Weather conditions verified. Request approved."
  },
  {
    employeeName: "Michael Brown",
    employeeId: "EMP003",
    location: "Chicago, IL",
    description: "Blizzard conditions with zero visibility and icy roads.",
    verificationResult: {
      isVerified: true,
      weatherData: {
        temperature: -10,
        condition: "Blizzard",
        humidity: 90,
        windSpeed: 45,
        alerts: [
          {
            type: "Blizzard Warning",
            message: "Blizzard conditions with strong winds",
            time: "2024-12-05T07:00:00.000Z"
          }
        ]
      }
    },
    status: "pending",
    comment: ""
  }
];

const dummyWorkReports = [
  {
    date: "2024-01-15",
    project: "Website Redesign",
    tasks: "Completed user interface mockups, started frontend development",
    location: "home",
    status: "completed"
  },
  {
    date: "2024-01-16",
    project: "Website Redesign",
    tasks: "Implemented responsive design, fixed mobile navigation issues",
    location: "office",
    status: "completed"
  },
  {
    date: "2024-01-17",
    project: "Mobile App Development",
    tasks: "Working on authentication system, set up backend API",
    location: "home",
    status: "in-progress"
  },
  {
    date: "2024-01-18",
    project: "Database Optimization",
    tasks: "Analyzed query performance, started indexing optimization",
    location: "office",
    status: "in-progress"
  },
  {
    date: "2024-01-19",
    project: "Security Audit",
    tasks: "Reviewing authentication mechanisms, testing for vulnerabilities",
    location: "home",
    status: "pending"
  },
  {
    date: "2024-01-22",
    project: "API Documentation",
    tasks: "Updated REST API documentation, added code examples",
    location: "office",
    status: "completed"
  }
];

async function seedEmployeeData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create an employee user
    let employee = await User.findOne({ role: 'employee' });
    
    if (!employee) {
      console.log('📝 No employee user found. Creating employee user...');
      employee = await User.create({
        email: 'employee@test.com',
        password: 'employee123',
        name: 'John Smith',
        role: 'employee',
        avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=667eea&color=fff'
      });
      console.log('✅ Employee user created');
    }

    // Get or create an admin user
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('📝 No admin user found. Creating admin user...');
      admin = await User.create({
        email: 'admin@test.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ff6b6b&color=fff'
      });
      console.log('✅ Admin user created');
    }

    console.log(`📝 Seeding data for employee: ${employee.email}`);

    // Clear existing data for this employee
    await WeatherAbsence.deleteMany({ userId: employee._id });
    await WorkReport.deleteMany({ userId: employee._id });
    console.log('🗑️  Cleared existing employee data');

    // Add userId to absence requests
    const absenceToSeed = dummyAbsenceRequests.map((req, index) => ({
      ...req,
      userId: employee._id,
      submittedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)) // Stagger dates
    }));

    // Insert absence requests
    await WeatherAbsence.insertMany(absenceToSeed);
    console.log(`✅ Successfully seeded ${dummyAbsenceRequests.length} absence requests`);

    // Add userId to work reports
    const reportsToSeed = dummyWorkReports.map((report, index) => ({
      ...report,
      userId: employee._id,
      createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000))
    }));

    // Insert work reports
    await WorkReport.insertMany(reportsToSeed);
    console.log(`✅ Successfully seeded ${dummyWorkReports.length} work reports`);

    // Show summary
    const absenceCount = await WeatherAbsence.countDocuments({ userId: employee._id });
    const reportCount = await WorkReport.countDocuments({ userId: employee._id });
    console.log(`📊 Total absence requests: ${absenceCount}`);
    console.log(`📊 Total work reports: ${reportCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding employee data:', error);
    process.exit(1);
  }
}

seedEmployeeData();

