// Weather service for backend automation
const axios = require('axios');

async function geocodeCity(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en`;
    const res = await axios.get(url, { timeout: 5000 });
    
    if (!res.data.results || res.data.results.length === 0) {
      throw new Error(`City "${cityName}" not found`);
    }
    
    const place = res.data.results[0];
    return { lat: place.latitude, lon: place.longitude, name: place.name };
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
}

function mapWeatherCodeToCondition(code) {
  const codes = {
    0: 'sunny',
    1: 'partly-cloudy', 2: 'partly-cloudy', 3: 'cloudy',
    45: 'cloudy', 48: 'cloudy',
    51: 'rainy', 53: 'rainy', 55: 'rainy',
    56: 'rainy', 57: 'rainy',
    61: 'rainy', 63: 'rainy', 65: 'rainy',
    66: 'rainy', 67: 'rainy',
    71: 'cloudy', 73: 'cloudy', 75: 'cloudy', 77: 'cloudy',
    80: 'rainy', 81: 'rainy', 82: 'stormy',
    85: 'cloudy', 86: 'cloudy',
    95: 'stormy', 96: 'stormy', 99: 'stormy'
  };
  return codes[code] || 'partly-cloudy';
}

async function getWeatherData(cityName) {
  try {
    const loc = await geocodeCity(cityName);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
    const res = await axios.get(url, { timeout: 5000 });
    
    const data = res.data;
    const current = data.current;
    const condition = mapWeatherCodeToCondition(current.weather_code);
    
    return {
      city: loc.name,
      temperature: Math.round(current.temperature_2m),
      condition,
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m)
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather: ${error.message}`);
  }
}

module.exports = { getWeatherData };


