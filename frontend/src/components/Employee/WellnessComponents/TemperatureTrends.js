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

const ChartWrapper = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
`;

const Canvas = styled.svg`
  width: 100%;
  height: 220px;
  overflow: visible;
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
`;

const LegendSwatch = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: ${props => props.color};
  display: inline-block;
`;

const AxisLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #999;
`;

const Tips = styled.div`
  margin-top: 15px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #b45309;
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 0.9rem;
`;

function TemperatureTrends({ tempData }) {
  const historical = tempData?.historical || [];
  const forecast = tempData?.forecast || [];
  const currentTemp = tempData?.current ?? 0;
  
  const pointsActual = historical.slice(-6).concat([currentTemp]);
  const pointsForecast = forecast.slice(0, 6);

  const allPoints = pointsActual.concat(pointsForecast);
  
  // Safety check for empty arrays
  if (allPoints.length === 0) {
    allPoints.push(0);
  }
  
  const minTemp = Math.min(...allPoints, currentTemp) - 2;
  const maxTemp = Math.max(...allPoints, currentTemp) + 2;
  const tempRange = maxTemp - minTemp || 1; // Prevent division by zero

  const width = 560;
  const height = 200;
  const padding = 30;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  // Total positions: 7 actual (6 historical + today) + 5 forecast = 12 positions
  const totalPositions = 12;
  const actualStartIdx = 0;
  const todayIdx = 6; // Today is at position 6 (0-indexed: positions 0-6 are actual)
  const forecastStartIdx = 7; // Forecast starts at position 7

  const mapX = (positionIdx) => {
    if (totalPositions <= 1) return padding + plotWidth / 2;
    return padding + (positionIdx / (totalPositions - 1)) * plotWidth;
  };
  
  const mapY = (value) => {
    const ratio = (value - minTemp) / tempRange;
    return padding + (1 - ratio) * plotHeight;
  };

  const buildPath = (values, startPositionIdx) => {
    if (values.length === 0) return '';
    if (values.length === 1) {
      const x = mapX(startPositionIdx);
      const y = mapY(values[0]);
      return `M ${x} ${y}`;
    }
    return values
      .map((v, i) => {
        const x = mapX(startPositionIdx + i);
        const y = mapY(v);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Build forecast path that connects to the last actual point (today)
  const buildForecastPath = (values) => {
    if (values.length === 0) return '';
    const todayX = mapX(todayIdx);
    const todayY = mapY(pointsActual[pointsActual.length - 1] || currentTemp);
    
    const pathParts = [`M ${todayX} ${todayY}`];
    values.forEach((v, i) => {
      const x = mapX(forecastStartIdx + i);
      const y = mapY(v);
      pathParts.push(`L ${x} ${y}`);
    });
    return pathParts.join(' ');
  };

  const actualPath = buildPath(pointsActual, actualStartIdx);
  const forecastPath = buildForecastPath(pointsForecast);

  const xLabels = ['-6d','-5d','-4d','-3d','-2d','-1d','Today','+1d','+2d','+3d','+4d','+5d'];

  return (
    <Container>
      <Title>
        <Thermometer size={24} />
        Temperature Trends
      </Title>

      <ChartWrapper>
        <Canvas viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Temperature trends chart">
          <defs>
            <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea55" />
              <stop offset="100%" stopColor="#667eea00" />
            </linearGradient>
            <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b55" />
              <stop offset="100%" stopColor="#f59e0b00" />
            </linearGradient>
          </defs>

          <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="#ffffff" stroke="#e5e7eb" rx="8" />

          {actualPath && (
            <>
              <path d={actualPath} fill="none" stroke="#667eea" strokeWidth="3" />
              {pointsActual.map((v, i) => (
                <circle key={`a-${i}`} cx={mapX(actualStartIdx + i)} cy={mapY(v)} r={4} fill="#667eea" />
              ))}
            </>
          )}

          {forecastPath && (
            <>
              <path d={forecastPath} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 6" />
              {pointsForecast.map((v, i) => (
                <circle key={`f-${i}`} cx={mapX(forecastStartIdx + i)} cy={mapY(v)} r={4} fill="#f59e0b" />
              ))}
            </>
          )}
        </Canvas>

        <AxisLabel>
          {xLabels.map((lbl, i) => (
            <span key={i}>{lbl}</span>
          ))}
        </AxisLabel>

        <Legend>
          <LegendItem>
            <LegendSwatch color="#667eea" /> Actual
          </LegendItem>
          <LegendItem>
            <LegendSwatch color="#f59e0b" /> Forecast
          </LegendItem>
        </Legend>
      </ChartWrapper>

      <Tips>
        <strong>Note:</strong> Watch for sharp rises or drops. Dress and hydrate accordingly.
      </Tips>
    </Container>
  );
}

export default TemperatureTrends;


