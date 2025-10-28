const mongoose = require('mongoose');
const Memory = require('./models/Memory');
const User = require('./models/User');
require('dotenv').config();

const dummyMemories = [
  {
    title: "Beautiful Sunset in Paris",
    date: "2024-01-15",
    location: "Eiffel Tower, Paris",
    description: "An amazing sunset view from the top of the Eiffel Tower. The city was bathed in golden light.",
    images: []
  },
  {
    title: "Tokyo Cherry Blossoms",
    date: "2024-03-25",
    location: "Ueno Park, Tokyo",
    description: "The cherry blossoms were in full bloom. Such a magical experience!",
    images: []
  },
  {
    title: "Desert Adventure in Dubai",
    date: "2024-02-10",
    location: "Dubai Desert",
    description: "Incredible camel ride through the golden dunes. The silence and beauty of the desert was unforgettable.",
    images: []
  },
  {
    title: "Mountain Hike in Switzerland",
    date: "2024-06-05",
    location: "Swiss Alps",
    description: "Challenging hike but the views were absolutely worth it. Crystal clear air and breathtaking landscapes.",
    images: []
  },
  {
    title: "Beach Day in Maldives",
    date: "2024-07-18",
    location: "Maldives",
    description: "Perfect day on the white sandy beaches. The turquoise water was mesmerizing.",
    images: []
  },
  {
    title: "Romantic Dinner in Venice",
    date: "2024-04-20",
    location: "Venice, Italy",
    description: "Gondola ride through the canals followed by an amazing dinner. Venice truly is romantic!",
    images: []
  },
  {
    title: "Northern Lights in Norway",
    date: "2024-11-15",
    location: "Tromsø, Norway",
    description: "Saw the most incredible Northern Lights display. Nature's light show at its finest!",
    images: []
  },
  {
    title: "Safari in Kenya",
    date: "2024-08-12",
    location: "Masai Mara, Kenya",
    description: "Witnessed the Great Migration. Lions, elephants, and zebras in their natural habitat.",
    images: []
  }
];

async function seedMemories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the first user from the database or create a test user
    let user = await User.findOne();
    
    if (!user) {
      console.log('📝 No users found. Creating a test user...');
      // Create a test traveler user
      user = await User.create({
        email: 'traveler@test.com',
        password: 'traveler123',
        name: 'Test Traveler',
        role: 'traveler',
        avatar: 'https://ui-avatars.com/api/?name=Test+Traveler&background=667eea&color=fff'
      });
      console.log('✅ Test user created');
    }

    console.log(`📝 Seeding memories for user: ${user.email}`);

    // Clear existing memories for this user
    await Memory.deleteMany({ userId: user._id });
    console.log('🗑️  Cleared existing memories');

    // Add user ID to each memory
    const memoriesToSeed = dummyMemories.map(memory => ({
      ...memory,
      userId: user._id
    }));

    // Insert memories
    await Memory.insertMany(memoriesToSeed);
    console.log(`✅ Successfully seeded ${dummyMemories.length} memories`);

    // Show summary
    const count = await Memory.countDocuments({ userId: user._id });
    console.log(`📊 Total memories in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding memories:', error);
    process.exit(1);
  }
}

seedMemories();

