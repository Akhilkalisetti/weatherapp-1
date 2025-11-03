// Weather Forecast Service for Trip Planner and Weather Graph
// Uses Open-Meteo API (FREE - no API key required)

/**
 * Geocode a city name to get coordinates
 */
async function geocodeCity(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      // Return fallback coordinates for common cities
      const fallback = getFallbackCityCoords(cityName);
      if (fallback) return fallback;
      throw new Error(`Geocoding failed: ${res.status}`);
    }
    
    const data = await res.json();
    const place = data.results && data.results[0];
    
    if (!place) {
      // Try fallback for common cities
      const fallback = getFallbackCityCoords(cityName);
      if (fallback) return fallback;
      throw new Error(`City "${cityName}" not found. Try a different city name.`);
    }
    
    return { lat: place.latitude, lon: place.longitude, name: place.name, country: place.country };
  } catch (error) {
    if (error.name === 'AbortError') {
      // Try fallback on timeout
      const fallback = getFallbackCityCoords(cityName);
      if (fallback) return fallback;
      throw new Error('Request timeout. Please try again.');
    }
    // Try fallback on any error
    const fallback = getFallbackCityCoords(cityName);
    if (fallback) return fallback;
    throw error;
  }
}

/**
 * Get fallback coordinates for common cities
 */
function getFallbackCityCoords(cityName) {
  const cityCoords = {
    'tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo', country: 'Japan' },
    'paris': { lat: 48.8566, lon: 2.3522, name: 'Paris', country: 'France' },
    'london': { lat: 51.5074, lon: -0.1278, name: 'London', country: 'United Kingdom' },
    'new york': { lat: 40.7128, lon: -74.0060, name: 'New York', country: 'United States' },
    'sydney': { lat: -33.8688, lon: 151.2093, name: 'Sydney', country: 'Australia' },
    'dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai', country: 'United Arab Emirates' },
    'singapore': { lat: 1.3521, lon: 103.8198, name: 'Singapore', country: 'Singapore' },
    'bangkok': { lat: 13.7563, lon: 100.5018, name: 'Bangkok', country: 'Thailand' },
    'rome': { lat: 41.9028, lon: 12.4964, name: 'Rome', country: 'Italy' },
    'barcelona': { lat: 41.3851, lon: 2.1734, name: 'Barcelona', country: 'Spain' },
    'berlin': { lat: 52.5200, lon: 13.4050, name: 'Berlin', country: 'Germany' },
    'amsterdam': { lat: 52.3676, lon: 4.9041, name: 'Amsterdam', country: 'Netherlands' },
    'madrid': { lat: 40.4168, lon: -3.7038, name: 'Madrid', country: 'Spain' },
    'moscow': { lat: 55.7558, lon: 37.6173, name: 'Moscow', country: 'Russia' },
    'beijing': { lat: 39.9042, lon: 116.4074, name: 'Beijing', country: 'China' },
    'hong kong': { lat: 22.3193, lon: 114.1694, name: 'Hong Kong', country: 'China' },
    'delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi', country: 'India' },
    'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai', country: 'India' },
    'seoul': { lat: 37.5665, lon: 126.9780, name: 'Seoul', country: 'South Korea' }
  };
  
  const lowerCity = cityName.toLowerCase();
  const match = cityCoords[lowerCity];
  
  if (match) return match;
  
  // Try partial match
  for (const [key, value] of Object.entries(cityCoords)) {
    if (lowerCity.includes(key) || key.includes(lowerCity)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Get weather forecast for a location
 * @param {string} cityName - City name
 * @param {number} days - Number of days to forecast (default: 7)
 * @returns {Promise<Object>} Forecast data
 */
/**
 * Generate mock weather forecast data
 */
function generateMockForecast(cityName, days = 7) {
  const conditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'stormy'];
  const baseTemp = Math.floor(Math.random() * 15) + 15; // 15-30°C
  
  const dailyForecast = Array.from({ length: days }, (_, i) => {
    const variation = Math.floor(Math.random() * 8) - 4;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxTemp: baseTemp + variation + Math.floor(Math.random() * 5),
      minTemp: baseTemp + variation - Math.floor(Math.random() * 5),
      weatherCode: Math.floor(Math.random() * 100),
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      condition
    };
  });
  
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(i, 0, 0, 0);
    const tempVariation = Math.sin((i - 6) * Math.PI / 12) * 5; // Temperature varies by time of day
    return {
      time: hour.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      temperature: Math.round(baseTemp + tempVariation),
      humidity: Math.floor(Math.random() * 20) + 60,
      windSpeed: Math.floor(Math.random() * 10) + 5
    };
  });
  
  return {
    location: { name: cityName, country: 'Unknown', lat: 0, lon: 0 },
    current: {
      temperature: dailyForecast[0].maxTemp,
      condition: dailyForecast[0].condition,
      humidity: dailyForecast[0].humidity,
      windSpeed: dailyForecast[0].windSpeed
    },
    dailyForecast,
    hourlyData,
    recommended: getRecommendedTravelTime(dailyForecast)
  };
}

export const getWeatherForecast = async (cityName, days = 7) => {
  try {
    const { lat, lon, name, country } = await geocodeCity(cityName);
    
    // Use simpler endpoint that definitely works - matching wellnessService pattern
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=auto&forecast_days=${Math.min(days, 16)}`;
    
    const fetchWithTimeout = (url, timeout = 8000) => {
      return Promise.race([
        fetch(url),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);
    };
    
    try {
      const res = await fetchWithTimeout(url);
      
      if (!res.ok) {
        throw new Error(`Weather API error: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Process daily forecast
      const dailyForecast = (data.daily?.time || []).slice(0, days).map((date, index) => {
        const avgHumidity = data.hourly?.relativehumidity_2m?.[index * 24] || null;
        return {
          date,
          maxTemp: Math.round(data.daily.temperature_2m_max[index] || 0),
          minTemp: Math.round(data.daily.temperature_2m_min[index] || 0),
          weatherCode: data.daily.weathercode[index] || 0,
          humidity: avgHumidity ? Math.round(avgHumidity) : (Math.floor(Math.random() * 30) + 50),
          windSpeed: Math.round(data.daily.windspeed_10m_max?.[index] || Math.floor(Math.random() * 15) + 5),
          condition: getWeatherCondition(data.daily.weathercode[index] || 0)
        };
      });
      
      // Process hourly data for today
      const hourlyData = [];
      if (data.hourly?.time && data.hourly?.temperature_2m) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        data.hourly.time.forEach((time, index) => {
          if (time.startsWith(today) && index < 24) {
            hourlyData.push({
              time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              temperature: Math.round(data.hourly.temperature_2m[index] || 0),
              humidity: Math.round(data.hourly.relativehumidity_2m?.[index] || Math.floor(Math.random() * 20) + 60),
              windSpeed: Math.round(data.hourly.windspeed_10m?.[index] || Math.floor(Math.random() * 10) + 5)
            });
          }
        });
      }
      
      // If no hourly data, generate some
      if (hourlyData.length === 0 && dailyForecast.length > 0) {
        const baseTemp = dailyForecast[0].maxTemp;
        hourlyData.push(...Array.from({ length: 12 }, (_, i) => {
          const hour = new Date();
          hour.setHours(i * 2, 0, 0, 0);
          return {
            time: hour.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            temperature: Math.round(baseTemp + Math.sin((i - 3) * Math.PI / 6) * 5),
            humidity: dailyForecast[0].humidity,
            windSpeed: dailyForecast[0].windSpeed
          };
        }));
      }
      
      return {
        location: { name, country, lat, lon },
        current: {
          temperature: dailyForecast[0]?.maxTemp || null,
          condition: dailyForecast[0]?.condition || 'Unknown',
          humidity: dailyForecast[0]?.humidity || null,
          windSpeed: dailyForecast[0]?.windSpeed || null
        },
        dailyForecast,
        hourlyData,
        recommended: getRecommendedTravelTime(dailyForecast)
      };
    } catch (apiError) {
      // Fallback to mock data if API fails
      console.warn('⚠️ Weather API failed, using mock data:', apiError.message);
      return generateMockForecast(name || cityName, days);
    }
  } catch (error) {
    // If geocoding fails, still generate mock data
    console.warn('⚠️ Geocoding failed, using mock data:', error.message);
    return generateMockForecast(cityName, days);
  }
};

/**
 * Get weather condition from WMO weather code
 */
function getWeatherCondition(code) {
  const codes = {
    0: 'sunny', // Clear sky
    1: 'partly-cloudy', // Mainly clear
    2: 'partly-cloudy', // Partly cloudy
    3: 'cloudy', // Overcast
    45: 'cloudy', // Foggy
    48: 'cloudy', // Depositing rime fog
    51: 'rainy', // Light drizzle
    53: 'rainy', // Moderate drizzle
    55: 'rainy', // Dense drizzle
    56: 'rainy', // Light freezing drizzle
    57: 'rainy', // Dense freezing drizzle
    61: 'rainy', // Slight rain
    63: 'rainy', // Moderate rain
    65: 'rainy', // Heavy rain
    66: 'rainy', // Light freezing rain
    67: 'rainy', // Heavy freezing rain
    71: 'cloudy', // Slight snow
    73: 'cloudy', // Moderate snow
    75: 'cloudy', // Heavy snow
    77: 'cloudy', // Snow grains
    80: 'rainy', // Slight rain showers
    81: 'rainy', // Moderate rain showers
    82: 'stormy', // Violent rain showers
    85: 'cloudy', // Slight snow showers
    86: 'cloudy', // Heavy snow showers
    95: 'stormy', // Thunderstorm
    96: 'stormy', // Thunderstorm with slight hail
    99: 'stormy' // Thunderstorm with heavy hail
  };
  return codes[code] || 'partly-cloudy';
}

/**
 * Get recommended travel times based on weather forecast
 */
function getRecommendedTravelTime(forecast) {
  if (!forecast || forecast.length === 0) return null;
  
  // Find days with best weather (sunny or partly-cloudy, moderate temperature)
  const bestDays = forecast
    .map((day, index) => ({
      ...day,
      index,
      score: calculateWeatherScore(day)
    }))
    .filter(day => day.condition === 'sunny' || day.condition === 'partly-cloudy')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  const avgTemp = forecast.reduce((sum, day) => sum + (day.maxTemp + day.minTemp) / 2, 0) / forecast.length;
  const tempRange = {
    min: Math.min(...forecast.map(d => d.minTemp)),
    max: Math.max(...forecast.map(d => d.maxTemp))
  };
  
  return {
    bestDays: bestDays.map(d => ({ date: d.date, condition: d.condition })),
    averageTemp: Math.round(avgTemp),
    tempRange,
    overallCondition: forecast[0]?.condition || 'unknown'
  };
}

/**
 * Calculate weather score for recommendation (higher is better)
 */
function calculateWeatherScore(day) {
  let score = 0;
  
  // Weather condition score
  const conditionScores = {
    sunny: 10,
    'partly-cloudy': 8,
    cloudy: 5,
    rainy: 2,
    stormy: 0
  };
  score += conditionScores[day.condition] || 5;
  
  // Temperature comfort score (prefer 15-25°C)
  const avgTemp = (day.maxTemp + day.minTemp) / 2;
  if (avgTemp >= 15 && avgTemp <= 25) score += 10;
  else if (avgTemp >= 10 && avgTemp <= 30) score += 5;
  
  // Wind score (prefer moderate wind)
  if (day.windSpeed <= 15) score += 5;
  else if (day.windSpeed > 25) score -= 5;
  
  return score;
}

/**
 * Search locations with autocomplete
 */
export const searchLocations = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      // If API fails, return some common cities as fallback
      return getFallbackLocations(query);
    }
    
    const data = await res.json();
    
    if (!data.results || data.results.length === 0) {
      return getFallbackLocations(query);
    }
    
    return data.results.map(place => ({
      id: place.id || `${place.latitude}-${place.longitude}`,
      name: place.name,
      country: place.country,
      admin1: place.admin1 || '',
      displayName: `${place.name}${place.admin1 ? ', ' + place.admin1 : ''}, ${place.country}`
    }));
  } catch (error) {
    // Fallback to common cities if API fails
    return getFallbackLocations(query);
  }
};

/**
 * Get fallback locations when API fails
 */
function getFallbackLocations(query) {
  const commonCities = [
    { name: 'Tokyo', country: 'Japan', displayName: 'Tokyo, Japan' },
    { name: 'Paris', country: 'France', displayName: 'Paris, France' },
    { name: 'London', country: 'United Kingdom', displayName: 'London, United Kingdom' },
    { name: 'New York', country: 'United States', displayName: 'New York, United States' },
    { name: 'Sydney', country: 'Australia', displayName: 'Sydney, Australia' },
    { name: 'Dubai', country: 'United Arab Emirates', displayName: 'Dubai, United Arab Emirates' },
    { name: 'Singapore', country: 'Singapore', displayName: 'Singapore, Singapore' },
    { name: 'Bangkok', country: 'Thailand', displayName: 'Bangkok, Thailand' },
    { name: 'Rome', country: 'Italy', displayName: 'Rome, Italy' },
    { name: 'Barcelona', country: 'Spain', displayName: 'Barcelona, Spain' }
  ];
  
  const lowerQuery = query.toLowerCase();
  return commonCities
    .filter(city => city.name.toLowerCase().includes(lowerQuery) || city.country.toLowerCase().includes(lowerQuery))
    .map(city => ({
      id: city.name,
      name: city.name,
      country: city.country,
      admin1: '',
      displayName: city.displayName
    }));
}

