require('dotenv').config();

console.log('Environment variables:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

const mongoose = require('mongoose');

console.log('\nTesting MongoDB connection...');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  
  // Test creating a simple document
  const testSchema = new mongoose.Schema({
    name: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const TestModel = mongoose.model('Test', testSchema);
  
  const testDoc = new TestModel({ name: 'Test Document' });
  
  return testDoc.save();
})
.then((savedDoc) => {
  console.log('✅ Test document saved successfully:', savedDoc);
  
  // Test reading the document
  const TestModel = mongoose.model('Test');
  return TestModel.findById(savedDoc._id);
})
.then((retrievedDoc) => {
  console.log('✅ Test document retrieved successfully:', retrievedDoc);
  
  // Clean up test document
  const TestModel = mongoose.model('Test');
  return TestModel.deleteOne({ _id: retrievedDoc._id });
})
.then(() => {
  console.log('✅ Test document cleaned up');
  console.log('\n🎉 MongoDB connection and data storage test PASSED!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB test failed:', err);
  process.exit(1);
});
