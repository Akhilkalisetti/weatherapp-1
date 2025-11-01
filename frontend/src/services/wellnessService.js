// Wellness Weather Service for Employee Dashboard
// This service provides mock wellness data including AQI, UV Index, Pollen Count, etc.

// Use real-time data by default (Open-Meteo - FREE, no API key required)
// Set REACT_APP_USE_REAL_WEATHER=0 to use mock data instead
const USE_REAL = String(process.env.REACT_APP_USE_REAL_WEATHER || '1').trim() !== '0';

// --- Helpers for real-time data via Open-Meteo (FREE - no API key required) ---
async function geocodeCity(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en`; 
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
    const data = await res.json();
    const place = data.results && data.results[0];
    if (!place) throw new Error(`City "${cityName}" not found. Try a different city name.`);
    return { lat: place.latitude, lon: place.longitude, name: place.name };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

function getNowIsoHour() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return now.toISOString().slice(0, 13) + ':00';
}

function formatHourLabel(iso) {
  const d = new Date(iso);
  return `${d.getHours()}:00`;
}

// Approximate US EPA AQI from PM2.5 (simple breakpoint method)
function aqiFromPm25(pm) {
  // Breakpoints: https://www.airnow.gov/aqi/aqi-basics/
  const ranges = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 }
  ];
  for (const r of ranges) {
    if (pm >= r.cLow && pm <= r.cHigh) {
      return Math.round(((r.iHigh - r.iLow) / (r.cHigh - r.cLow)) * (pm - r.cLow) + r.iLow);
    }
  }
  return Math.min(500, Math.max(0, Math.round(pm))); // fallback
}

function aqiCategory(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

async function getWellnessDataReal(cityName) {
  const { lat, lon } = await geocodeCity(cityName);
  const nowIsoHour = getNowIsoHour();

  const urls = {
    weather: `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,uv_index&current=temperature_2m,uv_index&timezone=auto`,
    air: `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,pm10,ozone,nitrogen_dioxide&timezone=auto`,
    pollen: `https://pollen-api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=grass_pollen,tree_pollen,weed_pollen&timezone=auto`
  };

  const fetchWithTimeout = (url, timeout = 8000) => {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  const [weatherRes, airRes, pollenRes] = await Promise.all([
    fetchWithTimeout(urls.weather),
    fetchWithTimeout(urls.air),
    fetchWithTimeout(urls.pollen).catch(() => null) // Pollen API is optional
  ]);
  
  if (!weatherRes.ok) throw new Error(`Weather API error: ${weatherRes.status}`);
  if (!airRes.ok) throw new Error(`Air Quality API error: ${airRes.status}`);
  
  const weather = await weatherRes.json();
  const air = await airRes.json();
  const pollen = pollenRes && pollenRes.ok ? await pollenRes.json() : null;

  // Find index of current hour in hourly arrays
  const findHourIndex = (arr) => Math.max(0, (arr || []).indexOf(nowIsoHour));
  const wHourIdx = findHourIndex(weather.hourly?.time || []);
  const aHourIdx = findHourIndex(air.hourly?.time || []);
  const pHourIdx = findHourIndex(pollen?.hourly?.time || []);

  // Temperature current and series
  const tempSeries = weather.hourly?.temperature_2m || [];
  const currentTemp = weather.current?.temperature_2m ?? tempSeries[wHourIdx] ?? null;
  const histTemps = tempSeries.slice(Math.max(0, wHourIdx - 6), wHourIdx);
  const forecastTemps = tempSeries.slice(wHourIdx, wHourIdx + 6);

  // UV index current and series
  const uvSeries = weather.hourly?.uv_index || [];
  const uvCurrent = weather.current?.uv_index ?? uvSeries[wHourIdx] ?? 0;
  const uvForecast = (weather.hourly?.time || []).slice(wHourIdx, Math.min(wHourIdx + 6, uvSeries.length)).map((t, i) => ({
    time: formatHourLabel(t),
    value: uvSeries[wHourIdx + i]
  }));

  // Air quality from PM2.5 dominant
  const pm25Series = air.hourly?.pm2_5 || [];
  const pm10Series = air.hourly?.pm10 || [];
  const no2Series = air.hourly?.nitrogen_dioxide || [];
  const o3Series = air.hourly?.ozone || [];
  const pm25 = pm25Series[aHourIdx] ?? 0;
  const pm10 = pm10Series[aHourIdx] ?? 0;
  const no2 = no2Series[aHourIdx] ?? 0;
  const o3 = o3Series[aHourIdx] ?? 0;
  const aqi = aqiFromPm25(pm25);

  // Pollen (if available) - scale 0-6 by rough quantization
  const grass = pollen?.hourly?.grass_pollen?.[pHourIdx] ?? 0;
  const trees = pollen?.hourly?.tree_pollen?.[pHourIdx] ?? 0;
  const weeds = pollen?.hourly?.weed_pollen?.[pHourIdx] ?? 0;
  const quantize = (v) => Math.max(0, Math.min(6, Math.round(v / 20))); // rough scale

  // Generate personalized tips based on AQI levels
  const tips = [];
  
  if (aqi <= 50) {
    // Green Alert (Good Air Quality – AQI 0–50)
    tips.push({ type: 'outdoor', priority: 'low', message: '🌤️ Enjoy outdoor breaks — it\'s a great day for walking meetings or open-air lunches.' });
    tips.push({ type: 'air', priority: 'low', message: '🪴 Open windows for fresh air circulation in your workspace or at home.' });
    tips.push({ type: 'transport', priority: 'low', message: '🚴 Consider biking or walking to work — perfect weather and air quality for it.' });
    tips.push({ type: 'nature', priority: 'low', message: '🌳 Take a few minutes to enjoy nature — it boosts mood and productivity.' });
    tips.push({ type: 'eco', priority: 'low', message: '💡 Reminder: Keep practicing eco-friendly habits even when the air is good.' });
  } else if (aqi <= 100) {
    // Yellow Alert (Moderate Air Quality – AQI 51–100)
    tips.push({ type: 'sensitive', priority: 'medium', message: '😷 Sensitive individuals (asthma, allergies) should limit prolonged outdoor exposure.' });
    tips.push({ type: 'windows', priority: 'medium', message: '🌬️ Keep windows slightly closed if near busy roads.' });
    tips.push({ type: 'indoor', priority: 'medium', message: '☕ Choose indoor seating for breaks or lunch.' });
    tips.push({ type: 'plants', priority: 'medium', message: '🌱 Consider using air-purifying plants indoors (like snake plants or peace lilies).' });
    tips.push({ type: 'transport', priority: 'medium', message: '🚗 Carpool or use public transport — help reduce emissions on moderate days.' });
  } else {
    // Red Alert (Unhealthy Air Quality – AQI 151–200+)
    tips.push({ type: 'avoid', priority: 'high', message: '🚫 Avoid outdoor activities, including walking meetings or exercise.' });
    tips.push({ type: 'mask', priority: 'high', message: '😷 Use N95 or equivalent masks if outdoor exposure is unavoidable.' });
    tips.push({ type: 'indoor', priority: 'high', message: '🌬️ Keep office and home windows closed; use air purifiers if available.' });
    tips.push({ type: 'breaks', priority: 'high', message: '🧘 Take breaks indoors — try deep breathing or stretching in well-ventilated rooms.' });
    tips.push({ type: 'commute', priority: 'high', message: '🕓 If possible, adjust commuting times to avoid rush-hour pollution peaks.' });
    tips.push({ type: 'hydration', priority: 'high', message: '💧 Stay hydrated — clean air filters and drink plenty of water to reduce irritation.' });
  }
  
  // Add UV-related tips
  if (uvCurrent > 7) {
    tips.push({ type: 'sun', priority: 'high', message: '☀️ High UV index - use sunscreen and seek shade' });
  } else if (uvCurrent > 5) {
    tips.push({ type: 'sun', priority: 'medium', message: '☀️ Moderate UV - apply sunscreen when outdoors' });
  }

  return {
    airQuality: {
      aqi,
      category: aqiCategory(aqi),
      pollutants: {
        pm25: Math.round(pm25),
        pm10: Math.round(pm10),
        no2: Math.round(no2),
        o3: Math.round(o3)
      }
    },
    uvIndex: {
      current: Math.round(uvCurrent),
      max: Math.max(...uvSeries.slice(wHourIdx, wHourIdx + 12).map(v => Math.round(v || 0)), Math.round(uvCurrent) || 0),
      forecast: uvForecast
    },
    pollen: {
      grass: quantize(grass),
      trees: quantize(trees),
      weeds: quantize(weeds),
      mold: 0
    },
    temperature: {
      current: Math.round(currentTemp),
      feelsLike: Math.round(currentTemp),
      historical: histTemps.map(t => Math.round(t)),
      forecast: forecastTemps.map(t => Math.round(t))
    },
    tips
  };
}

export const getWellnessData = async (cityName) => {
  if (USE_REAL) {
    try {
      const realData = await getWellnessDataReal(cityName);
      // eslint-disable-next-line no-console
      console.log('✅ Using real-time weather data from Open-Meteo API');
      return realData;
    } catch (e) {
      // Fallback to mock on any error
      // eslint-disable-next-line no-console
      console.warn('⚠️ Real-time wellness fetch failed, falling back to mock data:', e?.message);
      console.warn('This is normal if the city is not found or API is temporarily unavailable.');
    }
  }
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock wellness data for major cities
  const mockWellnessData = {
    'Paris': {
      airQuality: {
        aqi: 45, // Good
        category: 'Good',
        pollutants: {
          pm25: 15,
          pm10: 28,
          no2: 25,
          o3: 42
        }
      },
      uvIndex: {
        current: 3,
        max: 5,
        forecast: [
          { time: '8:00', value: 1 },
          { time: '10:00', value: 2 },
          { time: '12:00', value: 4 },
          { time: '14:00', value: 5 },
          { time: '16:00', value: 3 },
          { time: '18:00', value: 1 }
        ]
      },
      pollen: {
        grass: 2, // Low
        trees: 4, // Moderate
        weeds: 1, // Low
        mold: 3
      },
      temperature: {
        current: 18,
        feelsLike: 19,
        historical: [16, 17, 18, 19, 18, 17, 18],
        forecast: [18, 20, 22, 21, 19, 17]
      },
      tips: [
        { type: 'outdoor', priority: 'low', message: '🌤️ Enjoy outdoor breaks — it\'s a great day for walking meetings or open-air lunches.' },
        { type: 'air', priority: 'low', message: '🪴 Open windows for fresh air circulation in your workspace or at home.' },
        { type: 'transport', priority: 'low', message: '🚴 Consider biking or walking to work — perfect weather and air quality for it.' },
        { type: 'nature', priority: 'low', message: '🌳 Take a few minutes to enjoy nature — it boosts mood and productivity.' },
        { type: 'eco', priority: 'low', message: '💡 Reminder: Keep practicing eco-friendly habits even when the air is good.' }
      ]
    },
    'Tokyo': {
      airQuality: {
        aqi: 32, // Good
        category: 'Good',
        pollutants: {
          pm25: 12,
          pm10: 22,
          no2: 20,
          o3: 35
        }
      },
      uvIndex: {
        current: 6,
        max: 8,
        forecast: [
          { time: '8:00', value: 2 },
          { time: '10:00', value: 4 },
          { time: '12:00', value: 7 },
          { time: '14:00', value: 8 },
          { time: '16:00', value: 5 },
          { time: '18:00', value: 2 }
        ]
      },
      pollen: {
        grass: 3,
        trees: 5, // High
        weeds: 2,
        mold: 4
      },
      temperature: {
        current: 22,
        feelsLike: 24,
        historical: [20, 21, 22, 23, 22, 21, 22],
        forecast: [22, 24, 25, 24, 23, 22]
      },
      tips: [
        { type: 'outdoor', priority: 'low', message: '🌤️ Enjoy outdoor breaks — it\'s a great day for walking meetings or open-air lunches.' },
        { type: 'air', priority: 'low', message: '🪴 Open windows for fresh air circulation in your workspace or at home.' },
        { type: 'transport', priority: 'low', message: '🚴 Consider biking or walking to work — perfect weather and air quality for it.' },
        { type: 'nature', priority: 'low', message: '🌳 Take a few minutes to enjoy nature — it boosts mood and productivity.' },
        { type: 'eco', priority: 'low', message: '💡 Reminder: Keep practicing eco-friendly habits even when the air is good.' },
        { type: 'sun', priority: 'high', message: '☀️ High UV index - use sunscreen and seek shade' }
      ]
    },
    'New York': {
      airQuality: {
        aqi: 78, // Moderate
        category: 'Moderate',
        pollutants: {
          pm25: 28,
          pm10: 45,
          no2: 35,
          o3: 52
        }
      },
      uvIndex: {
        current: 4,
        max: 6,
        forecast: [
          { time: '8:00', value: 1 },
          { time: '10:00', value: 3 },
          { time: '12:00', value: 5 },
          { time: '14:00', value: 6 },
          { time: '16:00', value: 4 },
          { time: '18:00', value: 2 }
        ]
      },
      pollen: {
        grass: 5, // High
        trees: 3,
        weeds: 4,
        mold: 6 // Very High
      },
      temperature: {
        current: 15,
        feelsLike: 14,
        historical: [13, 14, 15, 16, 15, 14, 15],
        forecast: [15, 16, 18, 17, 15, 14]
      },
      tips: [
        { type: 'sensitive', priority: 'medium', message: '😷 Sensitive individuals (asthma, allergies) should limit prolonged outdoor exposure.' },
        { type: 'windows', priority: 'medium', message: '🌬️ Keep windows slightly closed if near busy roads.' },
        { type: 'indoor', priority: 'medium', message: '☕ Choose indoor seating for breaks or lunch.' },
        { type: 'plants', priority: 'medium', message: '🌱 Consider using air-purifying plants indoors (like snake plants or peace lilies).' },
        { type: 'transport', priority: 'medium', message: '🚗 Carpool or use public transport — help reduce emissions on moderate days.' }
      ]
    },
    'London': {
      airQuality: {
        aqi: 58, // Moderate
        category: 'Moderate',
        pollutants: {
          pm25: 22,
          pm10: 38,
          no2: 42,
          o3: 55
        }
      },
      uvIndex: {
        current: 2,
        max: 3,
        forecast: [
          { time: '8:00', value: 0 },
          { time: '10:00', value: 1 },
          { time: '12:00', value: 2 },
          { time: '14:00', value: 3 },
          { time: '16:00', value: 2 },
          { time: '18:00', value: 0 }
        ]
      },
      pollen: {
        grass: 4,
        trees: 6, // Very High
        weeds: 5,
        mold: 3
      },
      temperature: {
        current: 12,
        feelsLike: 11,
        historical: [11, 12, 13, 12, 11, 10, 12],
        forecast: [12, 13, 14, 13, 12, 11]
      },
      tips: [
        { type: 'sensitive', priority: 'medium', message: '😷 Sensitive individuals (asthma, allergies) should limit prolonged outdoor exposure.' },
        { type: 'windows', priority: 'medium', message: '🌬️ Keep windows slightly closed if near busy roads.' },
        { type: 'indoor', priority: 'medium', message: '☕ Choose indoor seating for breaks or lunch.' },
        { type: 'plants', priority: 'medium', message: '🌱 Consider using air-purifying plants indoors (like snake plants or peace lilies).' },
        { type: 'transport', priority: 'medium', message: '🚗 Carpool or use public transport — help reduce emissions on moderate days.' }
      ]
    }
  };

  // Return mock data for known cities, or generate random data for others
  if (mockWellnessData[cityName]) {
    return mockWellnessData[cityName];
  }

  // Generate random wellness data for unknown cities
  const aqiValues = [25, 45, 65, 85, 95, 115];
  const uvValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const pollenLevels = [1, 2, 3, 4, 5, 6];
  const temps = [8, 12, 15, 20, 25, 30, 35];

  const randomAqi = aqiValues[Math.floor(Math.random() * aqiValues.length)];
  const randomUv = uvValues[Math.floor(Math.random() * uvValues.length)];
  
  // Determine AQI category
  let aqiCategory = 'Good';
  if (randomAqi > 50 && randomAqi <= 100) aqiCategory = 'Moderate';
  else if (randomAqi > 100 && randomAqi <= 150) aqiCategory = 'Unhealthy for Sensitive';
  else if (randomAqi > 150) aqiCategory = 'Unhealthy';

  return {
    airQuality: {
      aqi: randomAqi,
      category: aqiCategory,
      pollutants: {
        pm25: Math.floor(randomAqi * 0.4),
        pm10: Math.floor(randomAqi * 0.6),
        no2: Math.floor(randomAqi * 0.5),
        o3: Math.floor(randomAqi * 0.65)
      }
    },
    uvIndex: {
      current: randomUv,
      max: randomUv + 2,
      forecast: [
        { time: '8:00', value: Math.max(1, randomUv - 3) },
        { time: '10:00', value: Math.max(2, randomUv - 2) },
        { time: '12:00', value: Math.min(10, randomUv + 1) },
        { time: '14:00', value: randomUv },
        { time: '16:00', value: Math.max(2, randomUv - 2) },
        { time: '18:00', value: Math.max(1, randomUv - 4) }
      ]
    },
    pollen: {
      grass: pollenLevels[Math.floor(Math.random() * pollenLevels.length)],
      trees: pollenLevels[Math.floor(Math.random() * pollenLevels.length)],
      weeds: pollenLevels[Math.floor(Math.random() * pollenLevels.length)],
      mold: pollenLevels[Math.floor(Math.random() * pollenLevels.length)]
    },
    temperature: {
      current: temps[Math.floor(Math.random() * temps.length)],
      feelsLike: temps[Math.floor(Math.random() * temps.length)],
      historical: Array.from({ length: 7 }, () => 
        temps[Math.floor(Math.random() * temps.length)]
      ),
      forecast: Array.from({ length: 6 }, () => 
        temps[Math.floor(Math.random() * temps.length)]
      )
    },
    tips: (() => {
      const tips = [];
      if (randomAqi <= 50) {
        tips.push({ type: 'outdoor', priority: 'low', message: '🌤️ Enjoy outdoor breaks — it\'s a great day for walking meetings or open-air lunches.' });
        tips.push({ type: 'air', priority: 'low', message: '🪴 Open windows for fresh air circulation in your workspace or at home.' });
        tips.push({ type: 'transport', priority: 'low', message: '🚴 Consider biking or walking to work — perfect weather and air quality for it.' });
        tips.push({ type: 'nature', priority: 'low', message: '🌳 Take a few minutes to enjoy nature — it boosts mood and productivity.' });
        tips.push({ type: 'eco', priority: 'low', message: '💡 Reminder: Keep practicing eco-friendly habits even when the air is good.' });
      } else if (randomAqi <= 100) {
        tips.push({ type: 'sensitive', priority: 'medium', message: '😷 Sensitive individuals (asthma, allergies) should limit prolonged outdoor exposure.' });
        tips.push({ type: 'windows', priority: 'medium', message: '🌬️ Keep windows slightly closed if near busy roads.' });
        tips.push({ type: 'indoor', priority: 'medium', message: '☕ Choose indoor seating for breaks or lunch.' });
        tips.push({ type: 'plants', priority: 'medium', message: '🌱 Consider using air-purifying plants indoors (like snake plants or peace lilies).' });
        tips.push({ type: 'transport', priority: 'medium', message: '🚗 Carpool or use public transport — help reduce emissions on moderate days.' });
      } else {
        tips.push({ type: 'avoid', priority: 'high', message: '🚫 Avoid outdoor activities, including walking meetings or exercise.' });
        tips.push({ type: 'mask', priority: 'high', message: '😷 Use N95 or equivalent masks if outdoor exposure is unavoidable.' });
        tips.push({ type: 'indoor', priority: 'high', message: '🌬️ Keep office and home windows closed; use air purifiers if available.' });
        tips.push({ type: 'breaks', priority: 'high', message: '🧘 Take breaks indoors — try deep breathing or stretching in well-ventilated rooms.' });
        tips.push({ type: 'commute', priority: 'high', message: '🕓 If possible, adjust commuting times to avoid rush-hour pollution peaks.' });
        tips.push({ type: 'hydration', priority: 'high', message: '💧 Stay hydrated — clean air filters and drink plenty of water to reduce irritation.' });
      }
      return tips;
    })()
  };
};

// Get AQI color based on value
export const getAQIColor = (aqi) => {
  if (aqi <= 50) return { color: '#00e400', bg: '#d4edda', risk: 'Good' };
  if (aqi <= 100) return { color: '#ffff00', bg: '#fff3cd', risk: 'Moderate' };
  if (aqi <= 150) return { color: '#ff7e00', bg: '#ffeaa7', risk: 'Unhealthy for Sensitive' };
  if (aqi <= 200) return { color: '#ff0000', bg: '#f8d7da', risk: 'Unhealthy' };
  if (aqi <= 300) return { color: '#8f3f97', bg: '#f1aeb5', risk: 'Very Unhealthy' };
  return { color: '#7e0023', bg: '#f5c6cb', risk: 'Hazardous' };
};

// Get UV risk level
export const getUVRisk = (uv) => {
  if (uv <= 2) return { risk: 'Low', color: '#00e400', bg: '#d4edda' };
  if (uv <= 5) return { risk: 'Moderate', color: '#ffff00', bg: '#fff3cd' };
  if (uv <= 7) return { risk: 'High', color: '#ff7e00', bg: '#ffeaa7' };
  if (uv <= 10) return { risk: 'Very High', color: '#ff0000', bg: '#f8d7da' };
  return { risk: 'Extreme', color: '#8f3f97', bg: '#f1aeb5' };
};

// Get pollen level description
export const getPollenLevel = (value) => {
  if (value <= 2) return { level: 'Low', color: '#00e400' };
  if (value <= 4) return { level: 'Moderate', color: '#ffff00' };
  if (value <= 6) return { level: 'High', color: '#ff7e00' };
  return { level: 'Very High', color: '#ff0000' };
};

// Get wellness tip icon
export const getTipIcon = (type) => {
  const icons = {
    hydration: '💧',
    sun: '☀️',
    mask: '😷',
    indoor: '🏠',
    allergen: '🌿',
    clothing: '🧥',
    general: 'ℹ️'
  };
  return icons[type] || '💡';
};

