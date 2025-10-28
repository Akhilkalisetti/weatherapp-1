// Mock country service - in a real app, this would connect to APIs like Wikipedia or REST Countries
export const getCountryInfo = async (countryName) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock country data
  const mockCountryData = {
    'France': {
      description: 'France is a country in Western Europe known for its rich history, culture, and cuisine. From the romantic streets of Paris to the beautiful countryside of Provence, France offers diverse experiences for every traveler.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
      currency: 'Euro (€)',
      language: 'French',
      timezone: 'CET (UTC+1)',
      population: '67 million',
      capital: 'Paris'
    },
    'Japan': {
      description: 'Japan is an island nation in East Asia known for its unique blend of ancient traditions and modern technology. From the bustling streets of Tokyo to the serene temples of Kyoto, Japan offers an unforgettable cultural experience.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      currency: 'Japanese Yen (¥)',
      language: 'Japanese',
      timezone: 'JST (UTC+9)',
      population: '126 million',
      capital: 'Tokyo'
    },
    'United States': {
      description: 'The United States is a vast country with diverse landscapes, cultures, and experiences. From the skyscrapers of New York to the natural wonders of the Grand Canyon, the US offers something for every type of traveler.',
      imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop',
      currency: 'US Dollar ($)',
      language: 'English',
      timezone: 'Multiple (UTC-5 to UTC-10)',
      population: '331 million',
      capital: 'Washington D.C.'
    },
    'United Kingdom': {
      description: 'The United Kingdom is a country steeped in history and tradition. From the royal palaces of London to the rolling hills of the countryside, the UK offers a rich cultural experience with its blend of ancient and modern attractions.',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
      currency: 'British Pound (£)',
      language: 'English',
      timezone: 'GMT (UTC+0)',
      population: '67 million',
      capital: 'London'
    },
    'Italy': {
      description: 'Italy is a country in Southern Europe known for its art, architecture, and cuisine. From the ancient ruins of Rome to the romantic canals of Venice, Italy offers a journey through history and culture.',
      imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop',
      currency: 'Euro (€)',
      language: 'Italian',
      timezone: 'CET (UTC+1)',
      population: '60 million',
      capital: 'Rome'
    },
    'Australia': {
      description: 'Australia is a vast island continent known for its unique wildlife, stunning landscapes, and vibrant cities. From the iconic Sydney Opera House to the natural wonders of the Great Barrier Reef, Australia offers diverse experiences.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      currency: 'Australian Dollar (A$)',
      language: 'English',
      timezone: 'Multiple (UTC+8 to UTC+10)',
      population: '25 million',
      capital: 'Canberra'
    }
  };

  // Return mock data for known countries, or generate generic data for others
  if (mockCountryData[countryName]) {
    return mockCountryData[countryName];
  }

  // Generate generic country data for unknown countries
  return {
    description: `${countryName} is a beautiful destination with rich culture and history. Explore its unique attractions, local cuisine, and immerse yourself in the local way of life.`,
    imageUrl: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=80`,
    currency: 'Local Currency',
    language: 'Local Language',
    timezone: 'Local Timezone',
    population: 'Unknown',
    capital: 'Unknown'
  };
};
