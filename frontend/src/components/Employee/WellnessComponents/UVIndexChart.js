import React, { useState } from 'react';
import styled from 'styled-components';
import { Sun, Shield } from 'lucide-react';
import { getUVRisk } from '../../../services/wellnessService';

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

const MainValue = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const UVValue = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: ${props => props.color};
  line-height: 1;
  margin-bottom: 10px;
`;

const UVCategory = styled.div`
  font-size: 1.2rem;
  color: #666;
  font-weight: 600;
`;

const ChartContainer = styled.div`
  margin-bottom: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
`;

const ChartBars = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 150px;
  gap: 5px;
`;

const Bar = styled.div`
  flex: 1;
  background: linear-gradient(180deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  border-radius: 6px 6px 0 0;
  height: ${props => props.height}%;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-3px);
  }
`;

const BarLabel = styled.div`
  font-size: 0.75rem;
  color: #999;
  margin-top: 5px;
  text-align: center;
`;

const XAxis = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
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

const SafetyTips = styled.div`
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 12px;
  padding: 15px;
`;

const TipList = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: #1976d2;
  font-size: 0.9rem;
`;

const TipItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const Tooltip = styled.div`
  position: absolute;
  background: #333;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #333;
  }
`;

function UVIndexChart({ uvData }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  
  if (!uvData || typeof uvData.current !== 'number') {
    return (
      <Container>
        <Title>
          <Sun size={24} />
          UV Index
        </Title>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No UV index data available
        </div>
      </Container>
    );
  }
  
  const uvRisk = getUVRisk(uvData.current);
  
  const getBarHeight = (value) => {
    // Scale to 0-150px height (assuming max UV of 11)
    return Math.min((value / 11) * 100, 100);
  };

  const getBarColor = (value) => {
    const risk = getUVRisk(value);
    return risk.color;
  };

  const getSafetyTips = (uv) => {
    if (uv <= 2) {
      return [
        'UV rays are minimal; sunscreen is optional',
        'Safe to be outside without protection'
      ];
    } else if (uv <= 5) {
      return [
        'Wear sunglasses and use sunscreen (SPF 30+)',
        'Seek shade during midday hours',
        'Wear protective clothing if you burn easily'
      ];
    } else if (uv <= 7) {
      return [
        'Apply sunscreen generously every 2 hours',
        'Wear a wide-brimmed hat and sunglasses',
        'Limit sun exposure between 10 AM and 4 PM',
        'Use UV-protective clothing'
      ];
    } else if (uv <= 10) {
      return [
        'Extra protection required - sunburn risk is high',
        'Avoid being in the sun between 10 AM and 4 PM',
        'Reapply sunscreen every 80 minutes if swimming',
        'Wear UV-blocking sunglasses and clothing',
        'Seek shade as much as possible'
      ];
    } else {
      return [
        'DANGER: Extremely high UV levels',
        'Avoid all sun exposure if possible',
        'If outdoors, use maximum protection',
        'Reapply sunscreen every 60 minutes',
        'Cover all exposed skin'
      ];
    }
  };

  return (
    <Container>
      <Title>
        <Sun size={24} />
        UV Index
      </Title>

      <MainValue>
        <UVValue color={uvRisk.color}>{uvData.current}</UVValue>
        <UVCategory>{uvRisk.risk}</UVCategory>
      </MainValue>

      <InfoCard bg={uvRisk.bg} border={uvRisk.color} color={uvRisk.color}>
        <InfoHeader>
          <Shield size={20} />
          Protection Required
        </InfoHeader>
        <div style={{ fontSize: '0.9rem', color: '#333' }}>
          {uvData.current <= 2 && 'Minimal protection needed. Safe to be outside.'}
          {uvData.current > 2 && uvData.current <= 5 && 'Moderate protection needed. Seek shade during midday.'}
          {uvData.current > 5 && uvData.current <= 7 && 'High protection required. Avoid midday sun.'}
          {uvData.current > 7 && uvData.current <= 10 && 'Very high risk. Avoid sun during peak hours.'}
          {uvData.current > 10 && 'Extreme risk! Avoid all sun exposure if possible.'}
        </div>
      </InfoCard>

      {uvData.forecast && uvData.forecast.length > 0 ? (
        <ChartContainer>
          <ChartBars>
            {uvData.forecast.map((point, index) => (
              <div 
                key={index}
                style={{ flex: 1 }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div style={{ position: 'relative', height: '100%' }}>
                  <Bar
                    height={getBarHeight(point.value)}
                    color={getBarColor(point.value)}
                    style={{ height: `${getBarHeight(point.value)}%` }}
                  >
                    <Tooltip show={hoveredBar === index}>
                      {point.time}: UV {point.value}
                    </Tooltip>
                  </Bar>
                </div>
              </div>
            ))}
          </ChartBars>
          <XAxis>
            {uvData.forecast.map((point, index) => (
              <BarLabel key={index}>{point.time}</BarLabel>
            ))}
          </XAxis>
        </ChartContainer>
      ) : (
        <ChartContainer>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            No forecast data available
          </div>
        </ChartContainer>
      )}

      <SafetyTips>
        <InfoHeader color="#1976d2">
          <Shield size={20} />
          Sun Safety Tips
        </InfoHeader>
        <TipList>
          {getSafetyTips(uvData.current).map((tip, index) => (
            <TipItem key={index}>{tip}</TipItem>
          ))}
        </TipList>
      </SafetyTips>
    </Container>
  );
}

export default UVIndexChart;

