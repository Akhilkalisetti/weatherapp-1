import React from 'react';
import styled from 'styled-components';
import { getTipIcon } from '../../../services/wellnessService';

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h3`
  color: #333;
  margin: 0 0 16px 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const TipCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const Icon = styled.div`
  font-size: 1.6rem;
`;

const Content = styled.div`
  flex: 1;
`;

const TipText = styled.div`
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const Priority = styled.span`
  display: inline-block;
  margin-top: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 999px;
  color: white;
  background: ${props => {
    if (props.level === 'high') return '#ef4444';
    if (props.level === 'medium') return '#f59e0b';
    return '#10b981';
  }};
`;

function PersonalizedTips({ tips }) {
  const normalized = (tips || []).map(t => ({
    icon: getTipIcon(t.type),
    text: t.message,
    priority: t.priority || 'low'
  }));

  return (
    <Container>
      <Title>Personalized Tips</Title>
      <Grid>
        {normalized.map((tip, idx) => (
          <TipCard key={idx}>
            <Icon>{tip.icon}</Icon>
            <Content>
              <TipText>{tip.text}</TipText>
              <Priority level={tip.priority}>{tip.priority}</Priority>
            </Content>
          </TipCard>
        ))}
      </Grid>
    </Container>
  );
}

export default PersonalizedTips;


