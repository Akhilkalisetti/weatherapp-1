// Trip Weather Alert Service
// Checks saved trips and generates weather alerts one day before trip start date

import { getWeatherForecast } from './weatherForecastService';

const ALERTS_STORAGE_KEY = 'tripWeatherAlerts';
const LAST_CHECK_STORAGE_KEY = 'lastTripCheck';

/**
 * Check for upcoming trips and generate weather alerts
 */
export const checkUpcomingTrips = async () => {
  try {
    const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    const alerts = JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]');
    const lastCheck = localStorage.getItem(LAST_CHECK_STORAGE_KEY);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Only check once per day
    if (lastCheck === today.toISOString().split('T')[0]) {
      return alerts;
    }
    
    const newAlerts = [];
    
    for (const trip of savedTrips) {
      // Skip if alert already sent
      if (trip.weatherAlertSent) continue;
      
      const tripStartDate = new Date(trip.startDate);
      tripStartDate.setHours(0, 0, 0, 0);
      
      // Check if trip starts tomorrow
      if (tripStartDate.getTime() === tomorrow.getTime()) {
        try {
          // Fetch latest weather forecast
          const forecast = await getWeatherForecast(trip.destination, 7);
          
          // Generate weather summary
          const currentDay = forecast.dailyForecast[0];
          const condition = getWeatherConditionEmoji(currentDay.condition);
          const tempRange = `${currentDay.minTemp}°C - ${currentDay.maxTemp}°C`;
          const summary = generateWeatherSummary(forecast, trip);
          
          // Create alert
          const alert = {
            id: `trip-${trip.id}-${Date.now()}`,
            tripId: trip.id,
            destination: trip.destination,
            country: trip.country || '',
            startDate: trip.startDate,
            temperature: currentDay.maxTemp,
            condition: currentDay.condition,
            summary,
            forecast: currentDay,
            createdAt: new Date().toISOString(),
            read: false,
            type: 'trip_reminder'
          };
          
          newAlerts.push(alert);
          
          // Mark trip as alert sent
          trip.weatherAlertSent = true;
          
        } catch (error) {
          console.error(`Failed to fetch weather for ${trip.destination}:`, error);
          // Create alert without weather data
          const alert = {
            id: `trip-${trip.id}-${Date.now()}`,
            tripId: trip.id,
            destination: trip.destination,
            country: trip.country || '',
            startDate: trip.startDate,
            summary: `Your trip to ${trip.destination} starts tomorrow! Weather forecast unavailable.`,
            createdAt: new Date().toISOString(),
            read: false,
            type: 'trip_reminder',
            error: true
          };
          newAlerts.push(alert);
        }
      }
    }
    
    // Update saved trips with alert sent status
    if (newAlerts.length > 0) {
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    }
    
    // Save new alerts
    const allAlerts = [...alerts, ...newAlerts].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(allAlerts));
    
    // Update last check date
    localStorage.setItem(LAST_CHECK_STORAGE_KEY, today.toISOString().split('T')[0]);
    
    return allAlerts;
  } catch (error) {
    console.error('Error checking upcoming trips:', error);
    return JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]');
  }
};

/**
 * Get weather condition emoji
 */
function getWeatherConditionEmoji(condition) {
  const emojis = {
    sunny: '☀️',
    'partly-cloudy': '⛅',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️'
  };
  return emojis[condition] || '🌤️';
}

/**
 * Generate weather summary for alert
 */
function generateWeatherSummary(forecast, trip) {
  const currentDay = forecast.dailyForecast[0];
  const conditionEmoji = getWeatherConditionEmoji(currentDay.condition);
  const conditionText = currentDay.condition.charAt(0).toUpperCase() + currentDay.condition.slice(1).replace('-', ' ');
  
  const tempText = currentDay.maxTemp === currentDay.minTemp 
    ? `${currentDay.maxTemp}°C` 
    : `${currentDay.minTemp}°C - ${currentDay.maxTemp}°C`;
  
  let recommendation = '';
  if (currentDay.condition === 'sunny' || currentDay.condition === 'partly-cloudy') {
    recommendation = 'Perfect weather for sightseeing!';
  } else if (currentDay.condition === 'rainy') {
    recommendation = 'Pack an umbrella!';
  } else if (currentDay.condition === 'stormy') {
    recommendation = 'Consider indoor activities.';
  } else {
    recommendation = 'Weather conditions are moderate.';
  }
  
  return `${conditionEmoji} Tomorrow in ${trip.destination}: ${tempText}, ${conditionText.toLowerCase()}. ${recommendation}`;
}

/**
 * Get all alerts
 */
export const getAlerts = () => {
  return JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]');
};

/**
 * Get unread alerts count
 */
export const getUnreadAlertsCount = () => {
  const alerts = getAlerts();
  return alerts.filter(alert => !alert.read).length;
};

/**
 * Mark alert as read
 */
export const markAlertAsRead = (alertId) => {
  const alerts = getAlerts();
  const updatedAlerts = alerts.map(alert => 
    alert.id === alertId ? { ...alert, read: true } : alert
  );
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
  return updatedAlerts;
};

/**
 * Mark all alerts as read
 */
export const markAllAlertsAsRead = () => {
  const alerts = getAlerts();
  const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
  return updatedAlerts;
};

/**
 * Delete alert
 */
export const deleteAlert = (alertId) => {
  const alerts = getAlerts();
  const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
  return updatedAlerts;
};

/**
 * Delete all alerts
 */
export const deleteAllAlerts = () => {
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify([]));
  return [];
};

