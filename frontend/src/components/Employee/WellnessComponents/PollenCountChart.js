import React from 'react';
import styled from 'styled-components';
import { Flower, AlertCircle } from 'lucide-react';
import { getPollenLevel } from '../../../services/wellnessService';

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

const HeatMapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const HeatMapCell = styled.div`
  background: linear-gradient(135deg, ${props => props.color}15 0%, ${props => props.color}25 100%);
  border: 2px solid ${props => props.color};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, ${props => props.color}25 0%, ${props => props.color}35 100%);
  }
`;

const PollenType = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
`;

const PollenValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 8px;
`;

const PollenLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.color};
  font-weight: 600;
`;

const BarChartContainer = styled.div`
  margin-bottom: 20px;
`;

const BarChartTitle = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 15px;
  font-weight: 500;
`;

const BarItem = styled.div`
  margin-bottom: 15px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
`;

const BarLabel = styled.div`
  width: 100px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const BarWrapper = styled.div`
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  height: 30px;
  position: relative;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  transition: width 0.5s ease;
`;

const BarValue = styled.div`
  width: 50px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.color};
`;

const InfoCard = styled.div`
  background: ${props => props.bg || '#f0f9ff'};
  border: 1px solid ${props => props.border || '#bae6fd'};
  border-radius: 12px;
  padding: 15px;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 10px;
`;

const Recomendations = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: #0369a1;
  font-size: 0.9rem;
`;

const RecomendationItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e1e5e9;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #666;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

function PollenCountChart({ pollenData }) {
  if (!pollenData) {
    return (
      <Container>
        <Title>
          <Flower size={24} />
          Pollen Count
        </Title>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No pollen data available
        </div>
      </Container>
    );
  }
  
  const pollenTypes = [
    { key: 'grass', label: 'Grass' },
    { key: 'trees', label: 'Trees' },
    { key: 'weeds', label: 'Weeds' },
    { key: 'mold', label: 'Mold' }
  ];

  const getBarWidth = (value) => {
    // Scale to percentage (assuming max pollen of 6)
    return (value / 6) * 100;
  };

  const getHighestPollen = () => {
    const pollenValues = [
      { type: 'Grass', value: pollenData.grass },
      { type: 'Trees', value: pollenData.trees },
      { type: 'Weeds', value: pollenData.weeds },
      { type: 'Mold', value: pollenData.mold }
    ];
    return pollenValues.reduce((max, p) => p.value > max.value ? p : max);
  };

  const highestPollen = getHighestPollen();

  const getRecommendations = () => {
    const recommendations = [];
    
    if (highestPollen.value <= 2) {
      recommendations.push('Pollen levels are low - enjoy outdoor activities');
      recommendations.push('Allergies should be minimal');
    } else if (highestPollen.value <= 4) {
      recommendations.push('Moderate pollen levels - take precautions if sensitive');
      recommendations.push('Keep windows closed during high pollen times');
      recommendations.push('Shower after being outdoors to remove pollen');
    } else if (highestPollen.value <= 6) {
      recommendations.push('High pollen levels - sensitive individuals should avoid outdoor activities');
      recommendations.push('Use air conditioning or HEPA filters indoors');
      recommendations.push('Take allergy medication as prescribed');
      recommendations.push('Wear a mask when mowing or gardening');
    } else {
      recommendations.push('VERY HIGH pollen levels - stay indoors if possible');
      recommendations.push('Run air conditioning with HEPA filters');
      recommendations.push('Take allergy medication before symptoms start');
      recommendations.push('Change clothes and shower after being outside');
      recommendations.push('Keep car windows closed');
    }
    
    return recommendations;
  };

  const getLegend = () => {
    return [
      { level: 'Low', color: '#00e400', range: '0-2' },
      { level: 'Moderate', color: '#ffff00', range: '3-4' },
      { level: 'High', color: '#ff7e00', range: '5-6' },
      { level: 'Very High', color: '#ff0000', range: '7+' }
    ];
  };

  return (
    <Container>
      <Title>
        <Flower size={24} />
        Pollen Count
      </Title>

      <HeatMapGrid>
        {pollenTypes.map((type) => {
          const value = pollenData[type.key];
          const level = getPollenLevel(value);
          return (
            <HeatMapCell key={type.key} color={level.color}>
              <PollenType>{type.label}</PollenType>
              <PollenValue color={level.color}>{value}</PollenValue>
              <PollenLabel color={level.color}>{level.level}</PollenLabel>
            </HeatMapCell>
          );
        })}
      </HeatMapGrid>

      <BarChartContainer>
        <BarChartTitle>Allergen Levels by Type</BarChartTitle>
        {pollenTypes.map((type) => {
          const value = pollenData[type.key];
          const level = getPollenLevel(value);
          return (
            <BarItem key={type.key}>
              <BarRow>
                <BarLabel>{type.label}</BarLabel>
                <BarWrapper>
                  <Bar
                    width={getBarWidth(value)}
                    color={level.color}
                    style={{ width: `${getBarWidth(value)}%` }}
                  >
                    {value}
                  </Bar>
                </BarWrapper>
                <BarValue color={level.color}>{value}</BarValue>
              </BarRow>
            </BarItem>
          );
        })}
      </BarChartContainer>

      <Legend>
        {getLegend().map((item, index) => (
          <LegendItem key={index}>
            <LegendColor color={item.color} />
            <span>{item.level} ({item.range})</span>
          </LegendItem>
        ))}
      </Legend>

      <InfoCard>
        <InfoHeader>
          <AlertCircle size={20} />
          Allergy Recommendations
        </InfoHeader>
        <Recomendations>
          {getRecommendations().map((rec, index) => (
            <RecomendationItem key={index}>{rec}</RecomendationItem>
          ))}
        </Recomendations>
      </InfoCard>
    </Container>
  );
}

export default PollenCountChart;

