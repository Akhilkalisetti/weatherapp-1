const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('\n🔧 Setting up the backend server...\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists');
  console.log('To regenerate, delete it and run this script again.\n');
  process.exit(0);
}

// Create .env file
const envContent = `# MongoDB Atlas Connection
# Get your connection string from: https://cloud.mongodb.com/
MONGO_URI=your_mongodb_atlas_connection_string_here

# JWT Secret Key (auto-generated)
JWT_SECRET=${jwtSecret}

# Server Port
PORT=5000

# Environment
NODE_ENV=development
`;

fs.writeFileSync(envPath, envContent);

console.log('✅ Created .env file');
console.log('✅ Generated JWT Secret');
console.log('\n📋 Next steps:');
console.log('1. Open server/.env file');
console.log('2. Replace MONGO_URI with your MongoDB Atlas connection string');
console.log('3. To get a connection string:');
console.log('   - Go to https://cloud.mongodb.com/');
console.log('   - Create a free cluster');
console.log('   - Click "Connect" → "Connect your application"');
console.log('   - Copy the connection string');
console.log('   - Replace <password> with your database password');
console.log('\n4. Run: npm run dev\n');

