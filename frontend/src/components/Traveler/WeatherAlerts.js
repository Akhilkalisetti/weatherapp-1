import React from 'react';
import styled from 'styled-components';
import { AlertCircle, Sun, Cloud, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { getWeatherIcon, getWeatherDescription } from '../../services/weatherService';

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WeatherCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 25px;
  text-align: center;
`;

const WeatherIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 15px;
`;

const Temperature = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Condition = styled.div`
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const WeatherDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const DetailIcon = styled.div`
  opacity: 0.8;
`;

const DetailValue = styled.div`
  font-weight: 600;
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const AlertsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AlertCard = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'warning': return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
      case 'alert': return 'linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)';
      default: return 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
    }
  }};
  color: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const AlertIcon = styled.div`
  font-size: 1.5rem;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertMessage = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const AlertTime = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const NoCitySelected = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const NoAlerts = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

function WeatherAlerts({ selectedCity, weatherData }) {
  if (!selectedCity) {
    return (
      <WeatherContainer>
        <NoCitySelected>
          <AlertCircle size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <p>Select a city to view weather information and alerts</p>
        </NoCitySelected>
      </WeatherContainer>
    );
  }

  if (!weatherData) {
    return (
      <WeatherContainer>
        <NoCitySelected>
          <Cloud size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <p>Loading weather data for {selectedCity.name}...</p>
        </NoCitySelected>
      </WeatherContainer>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'alert': return '🚨';
      default: return 'ℹ️';
    }
  };

  return (
    <WeatherContainer>
      <WeatherCard>
        <WeatherIcon>{getWeatherIcon(weatherData.condition)}</WeatherIcon>
        <Temperature>{weatherData.temperature}°C</Temperature>
        <Condition>{getWeatherDescription(weatherData.condition)}</Condition>
        
        <WeatherDetails>
          <WeatherDetail>
            <DetailIcon>
              <Droplets size={20} />
            </DetailIcon>
            <DetailValue>{weatherData.humidity}%</DetailValue>
            <DetailLabel>Humidity</DetailLabel>
          </WeatherDetail>
          
          <WeatherDetail>
            <DetailIcon>
              <Wind size={20} />
            </DetailIcon>
            <DetailValue>{weatherData.windSpeed} km/h</DetailValue>
            <DetailLabel>Wind Speed</DetailLabel>
          </WeatherDetail>
        </WeatherDetails>
      </WeatherCard>

      <AlertsContainer>
        <h3 style={{ color: '#333', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} color="#667eea" />
          Weather Alerts
        </h3>
        
        {weatherData.alerts && weatherData.alerts.length > 0 ? (
          weatherData.alerts.map((alert, index) => (
            <AlertCard key={index} type={alert.type}>
              <AlertIcon>{getAlertIcon(alert.type)}</AlertIcon>
              <AlertContent>
                <AlertMessage>{alert.message}</AlertMessage>
                <AlertTime>Expected at {alert.time}</AlertTime>
              </AlertContent>
            </AlertCard>
          ))
        ) : (
          <NoAlerts>
            <Sun size={24} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>No weather alerts for {selectedCity.name} at this time</p>
          </NoAlerts>
        )}
      </AlertsContainer>
    </WeatherContainer>
  );
}

export default WeatherAlerts;
