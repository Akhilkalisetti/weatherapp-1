import React from 'react';
import styled from 'styled-components';
import { Thermometer } from 'lucide-react';

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h3`
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TemperatureDisplay = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  color: white;
`;

const CurrentTemp = styled.div`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1;
`;

const FeelsLike = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 20px;
`;

const TempInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
`;

const TempItem = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  backdrop-filter: blur(10px);
`;

const TempItemLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 8px;
`;

const TempItemValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

function TemperatureTrends({ tempData }) {
  if (!tempData) {
    return (
      <Container>
        <Title>
          <Thermometer size={24} />
          Temperature
        </Title>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No temperature data available
        </div>
      </Container>
    );
  }

  const currentTemp = tempData?.current ?? 0;
  const feelsLike = tempData?.feelsLike ?? currentTemp;
  const historical = tempData?.historical || [];
  const forecast = tempData?.forecast || [];

  const minHistorical = historical.length > 0 ? Math.min(...historical) : null;
  const maxHistorical = historical.length > 0 ? Math.max(...historical) : null;
  const minForecast = forecast.length > 0 ? Math.min(...forecast) : null;
  const maxForecast = forecast.length > 0 ? Math.max(...forecast) : null;

  return (
    <Container>
      <Title>
        <Thermometer size={24} />
        Temperature
      </Title>

      <TemperatureDisplay>
        <CurrentTemp>{currentTemp}°C</CurrentTemp>
        <FeelsLike>Feels like {feelsLike}°C</FeelsLike>
        
        <TempInfo>
          {minHistorical !== null && (
            <TempItem>
              <TempItemLabel>Min (Historical)</TempItemLabel>
              <TempItemValue>{minHistorical}°C</TempItemValue>
            </TempItem>
          )}
          {maxHistorical !== null && (
            <TempItem>
              <TempItemLabel>Max (Historical)</TempItemLabel>
              <TempItemValue>{maxHistorical}°C</TempItemValue>
            </TempItem>
          )}
          {minForecast !== null && (
            <TempItem>
              <TempItemLabel>Min (Forecast)</TempItemLabel>
              <TempItemValue>{minForecast}°C</TempItemValue>
            </TempItem>
          )}
          {maxForecast !== null && (
            <TempItem>
              <TempItemLabel>Max (Forecast)</TempItemLabel>
              <TempItemValue>{maxForecast}°C</TempItemValue>
            </TempItem>
          )}
        </TempInfo>
      </TemperatureDisplay>
    </Container>
  );
}

export default TemperatureTrends;


