// Mock weather service - in a real app, this would connect to a weather API like OpenWeatherMap
export const getWeatherData = async (cityName) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock weather data
  const mockWeatherData = {
    'Paris': {
      temperature: 18,
      condition: 'partly-cloudy',
      humidity: 65,
      windSpeed: 12,
      alerts: [
        {
          type: 'warning',
          message: 'Light rain expected in the afternoon',
          time: '14:00'
        }
      ]
    },
    'Tokyo': {
      temperature: 22,
      condition: 'sunny',
      humidity: 70,
      windSpeed: 8,
      alerts: [
        {
          type: 'info',
          message: 'Perfect weather for sightseeing today',
          time: '09:00'
        }
      ]
    },
    'New York': {
      temperature: 15,
      condition: 'rainy',
      humidity: 80,
      windSpeed: 15,
      alerts: [
        {
          type: 'warning',
          message: 'Heavy rain and strong winds expected',
          time: '16:00'
        },
        {
          type: 'info',
          message: 'Umbrella recommended for outdoor activities',
          time: '10:00'
        }
      ]
    },
    'London': {
      temperature: 12,
      condition: 'cloudy',
      humidity: 75,
      windSpeed: 10,
      alerts: [
        {
          type: 'info',
          message: 'Typical London weather - overcast skies',
          time: '08:00'
        }
      ]
    }
  };

  // Return mock data for known cities, or generate random data for others
  if (mockWeatherData[cityName]) {
    return mockWeatherData[cityName];
  }

  // Generate random weather data for unknown cities
  const conditions = ['sunny', 'cloudy', 'partly-cloudy', 'rainy', 'stormy'];
  const alertTypes = ['info', 'warning', 'alert'];
  const alertMessages = [
    'Perfect weather for outdoor activities',
    'Light rain expected later today',
    'Strong winds in the forecast',
    'Temperature dropping in the evening',
    'Clear skies and pleasant conditions'
  ];

  return {
    temperature: Math.floor(Math.random() * 25) + 5, // 5-30°C
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    alerts: [
      {
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
        time: `${Math.floor(Math.random() * 12) + 8}:00`
      }
    ]
  };
};

export const getWeatherIcon = (condition) => {
  const icons = {
    'sunny': '☀️',
    'cloudy': '☁️',
    'partly-cloudy': '⛅',
    'rainy': '🌧️',
    'stormy': '⛈️'
  };
  return icons[condition] || '🌤️';
};

export const getWeatherDescription = (condition) => {
  const descriptions = {
    'sunny': 'Sunny',
    'cloudy': 'Cloudy',
    'partly-cloudy': 'Partly Cloudy',
    'rainy': 'Rainy',
    'stormy': 'Stormy'
  };
  return descriptions[condition] || 'Unknown';
};
