import React, { useState } from 'react';
import styled from 'styled-components';
import { Wind, AlertCircle } from 'lucide-react';
import { getAQIColor } from '../../../services/wellnessService';

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

const GaugeContainer = styled.div`
  position: relative;
  height: 200px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Gauge = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

const GaugeBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 20px solid #e1e5e9;
  border-top-color: ${props => props.color};
  border-right-color: ${props => props.color};
  transform: rotate(-45deg);
`;

const GaugeValue = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Value = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.color};
`;

const Category = styled.div`
  font-size: 1rem;
  color: #666;
  margin-top: 5px;
`;

const BarChart = styled.div`
  margin-bottom: 20px;
`;

const BarChartTitle = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
`;

const BarContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  height: 30px;
  display: flex;
  align-items: center;
  position: relative;
`;

const Bar = styled.div`
  height: 20px;
  background: linear-gradient(90deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
`;

const InfoCard = styled.div`
  background: ${props => props.bg};
  border: 1px solid ${props => props.border || props.bg};
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: ${props => props.color};
  margin-bottom: 10px;
`;

const PollutantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const Pollutant = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const PollutantLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
`;

const PollutantValue = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
`;

const Tooltip = styled.div`
  position: absolute;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  white-space: nowrap;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: opacity 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #333;
  }
`;

function AQIVisualization({ airQuality }) {
  const [tooltip, setTooltip] = useState(null);
  
  if (!airQuality || typeof airQuality.aqi !== 'number') {
    return (
      <Container>
        <Title>
          <Wind size={24} />
          Air Quality Index (AQI)
        </Title>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No air quality data available
        </div>
      </Container>
    );
  }
  
  const aqiInfo = getAQIColor(airQuality.aqi);
  
  const getBarWidth = (value) => {
    // Normalize to percentage (assuming max AQI of 300)
    return Math.min((value / 300) * 100, 100);
  };

  return (
    <Container>
      <Title>
        <Wind size={24} />
        Air Quality Index (AQI)
      </Title>

      <GaugeContainer>
        <Gauge>
          <GaugeBackground color={aqiInfo.color} />
          <GaugeValue>
            <Value color={aqiInfo.color}>{airQuality.aqi}</Value>
            <Category>{airQuality.category}</Category>
          </GaugeValue>
        </Gauge>
      </GaugeContainer>

      <InfoCard bg={aqiInfo.bg} border={aqiInfo.color} color={aqiInfo.color}>
        <InfoHeader>
          <AlertCircle size={20} />
          Health Advisory
        </InfoHeader>
        <div style={{ fontSize: '0.9rem', color: '#333' }}>
          {airQuality.aqi <= 50 && 'Air quality is satisfactory, and air pollution poses little or no risk.'}
          {airQuality.aqi > 50 && airQuality.aqi <= 100 && 'Air quality is acceptable; however, some pollutants may pose a moderate health concern for sensitive individuals.'}
          {airQuality.aqi > 100 && airQuality.aqi <= 150 && 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.'}
          {airQuality.aqi > 150 && airQuality.aqi <= 200 && 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.'}
          {airQuality.aqi > 200 && 'Health alert: everyone may experience more serious health effects.'}
        </div>
      </InfoCard>

      <BarChart
        onMouseEnter={() => setTooltip('AQI')}
        onMouseLeave={() => setTooltip(null)}
        style={{ position: 'relative' }}
      >
        <BarChartTitle>Air Quality Level</BarChartTitle>
        <BarContainer>
          <Bar 
            width={getBarWidth(airQuality.aqi)} 
            color={aqiInfo.color}
            style={{ width: `${getBarWidth(airQuality.aqi)}%` }}
          >
            {airQuality.aqi}
          </Bar>
          <Tooltip show={tooltip === 'AQI'}>
            Current AQI: {airQuality.aqi} ({airQuality.category})
          </Tooltip>
        </BarContainer>
      </BarChart>

      <PollutantsGrid>
        <Pollutant>
          <PollutantLabel>PM2.5</PollutantLabel>
          <PollutantValue>{airQuality.pollutants.pm25} μg/m³</PollutantValue>
        </Pollutant>
        <Pollutant>
          <PollutantLabel>PM10</PollutantLabel>
          <PollutantValue>{airQuality.pollutants.pm10} μg/m³</PollutantValue>
        </Pollutant>
        <Pollutant>
          <PollutantLabel>NO₂</PollutantLabel>
          <PollutantValue>{airQuality.pollutants.no2} μg/m³</PollutantValue>
        </Pollutant>
        <Pollutant>
          <PollutantLabel>O₃</PollutantLabel>
          <PollutantValue>{airQuality.pollutants.o3} μg/m³</PollutantValue>
        </Pollutant>
      </PollutantsGrid>
    </Container>
  );
}

export default AQIVisualization;

