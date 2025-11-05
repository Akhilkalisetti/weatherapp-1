// Live weather service using Open-Meteo (same API family used by traveler)
// No API key required

async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  if (!res.ok) throw new Error('Failed to find location');
  const data = await res.json();
  const place = data.results && data.results[0];
  if (!place) throw new Error(`City "${cityName}" not found`);
  return { lat: place.latitude, lon: place.longitude, name: place.name };
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

function normalizeCurrentWeather(json, meta) {
  const cur = json?.current;
  const condition = mapWeatherCodeToCondition(cur?.weather_code);
  return {
    city: meta?.name,
    temperature: typeof cur?.temperature_2m === 'number' ? Math.round(cur.temperature_2m) : undefined,
    condition,
    humidity: typeof cur?.relative_humidity_2m === 'number' ? Math.round(cur.relative_humidity_2m) : undefined,
    windSpeed: typeof cur?.wind_speed_10m === 'number' ? Math.round(cur.wind_speed_10m) : undefined,
    alerts: []
  };
}

export const getWeatherData = async (cityName) => {
  const loc = await geocodeCity(cityName);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather');
  const data = await res.json();
  return normalizeCurrentWeather(data, { name: loc.name });
};

export const getWeatherByCoords = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather');
  const data = await res.json();
  return normalizeCurrentWeather(data, {});
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
