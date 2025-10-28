import React from 'react';
import styled from 'styled-components';
import { Eye, Heart, Utensils, Shirt, Lightbulb, MapPin } from 'lucide-react';

const AdviceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AdviceSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #667eea;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
`;

const SectionContent = styled.div`
  color: #666;
  line-height: 1.6;
`;

const AdviceList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #666;
`;

const AdviceItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const CountryImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 20px;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
  }
  
  span {
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const CountryDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  font-style: italic;
`;

// Mock travel advice data
const getTravelAdvice = (city) => {
  const adviceData = {
    'Paris': {
      sightseeing: [
        'Visit the Eiffel Tower at sunset for the best views',
        'Explore the Louvre Museum (book tickets in advance)',
        'Walk along the Seine River and visit Notre-Dame',
        'Stroll through Montmartre and see Sacré-Cœur',
        'Visit the Palace of Versailles for a day trip'
      ],
      culture: [
        'Learn basic French phrases - locals appreciate the effort',
        'Dress stylishly - Parisians value fashion',
        'Respect meal times - lunch is typically 12-2 PM',
        'Greet shopkeepers with "Bonjour" when entering stores',
        'Tipping is not mandatory but appreciated for good service'
      ],
      food: [
        'Try authentic croissants from local boulangeries',
        'Experience a traditional French dinner (3+ courses)',
        'Visit local markets for fresh produce and cheese',
        'Try escargot and other French delicacies',
        'Don\'t miss the wine - French wine is world-renowned'
      ],
      clothing: [
        'Pack layers - weather can change quickly',
        'Comfortable walking shoes are essential',
        'Dress modestly when visiting religious sites',
        'Bring an umbrella - Paris can be rainy',
        'Smart casual attire for restaurants and attractions'
      ],
      tips: [
        'Get a Paris Pass for free museum entries and transport',
        'Use the Metro for efficient city transportation',
        'Book popular attractions in advance online',
        'Carry cash - some places don\'t accept cards',
        'Be aware of pickpockets in tourist areas'
      ]
    },
    'Tokyo': {
      sightseeing: [
        'Visit Senso-ji Temple in Asakusa',
        'Experience the bustling Shibuya Crossing',
        'Explore the historic Meiji Shrine',
        'See the cherry blossoms in Ueno Park (spring)',
        'Visit the Tokyo Skytree for panoramic views'
      ],
      culture: [
        'Bow when greeting - it\'s a sign of respect',
        'Remove shoes when entering homes and some restaurants',
        'Be quiet on public transportation',
        'Don\'t eat or drink while walking',
        'Learn basic Japanese phrases like "arigato" (thank you)'
      ],
      food: [
        'Try authentic ramen at local ramen shops',
        'Experience sushi at Tsukiji Fish Market',
        'Try street food in Harajuku and Shibuya',
        'Don\'t miss Japanese tea ceremony',
        'Try wagyu beef and other premium Japanese cuisine'
      ],
      clothing: [
        'Dress modestly and conservatively',
        'Remove shoes when required - wear easy-to-remove footwear',
        'Pack for the season - Tokyo has distinct seasons',
        'Bring comfortable walking shoes',
        'Dress appropriately for temple visits'
      ],
      tips: [
        'Get a JR Pass for unlimited train travel',
        'Learn to use chopsticks properly',
        'Carry cash - many places don\'t accept cards',
        'Download translation apps for communication',
        'Respect the culture of silence and order'
      ]
    }
  };

  return adviceData[city] || {
    sightseeing: ['Explore local landmarks and attractions', 'Visit museums and cultural sites', 'Take walking tours of the city'],
    culture: ['Learn about local customs and traditions', 'Respect cultural differences', 'Try to learn basic local phrases'],
    food: ['Try local cuisine and specialties', 'Visit local markets and restaurants', 'Ask locals for food recommendations'],
    clothing: ['Pack appropriate clothing for the climate', 'Bring comfortable walking shoes', 'Dress modestly when visiting religious sites'],
    tips: ['Research local transportation options', 'Learn about local customs and etiquette', 'Keep important documents safe']
  };
};

function TravelAdvice({ city, countryInfo }) {
  if (!city) {
    return (
      <AdviceContainer>
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          Select a city to see travel advice and recommendations
        </p>
      </AdviceContainer>
    );
  }

  const advice = getTravelAdvice(city.name);

  return (
    <AdviceContainer>
      <CountryImage imageUrl={countryInfo?.imageUrl}>
        <span>{city.name}, {city.country}</span>
      </CountryImage>
      
      {countryInfo?.description && (
        <CountryDescription>
          {countryInfo.description}
        </CountryDescription>
      )}

      <AdviceSection>
        <SectionHeader>
          <Eye size={20} color="#667eea" />
          <SectionTitle>Sightseeing</SectionTitle>
        </SectionHeader>
        <AdviceList>
          {advice.sightseeing.map((item, index) => (
            <AdviceItem key={index}>{item}</AdviceItem>
          ))}
        </AdviceList>
      </AdviceSection>

      <AdviceSection>
        <SectionHeader>
          <Heart size={20} color="#667eea" />
          <SectionTitle>Culture & Etiquette</SectionTitle>
        </SectionHeader>
        <AdviceList>
          {advice.culture.map((item, index) => (
            <AdviceItem key={index}>{item}</AdviceItem>
          ))}
        </AdviceList>
      </AdviceSection>

      <AdviceSection>
        <SectionHeader>
          <Utensils size={20} color="#667eea" />
          <SectionTitle>Food & Dining</SectionTitle>
        </SectionHeader>
        <AdviceList>
          {advice.food.map((item, index) => (
            <AdviceItem key={index}>{item}</AdviceItem>
          ))}
        </AdviceList>
      </AdviceSection>

      <AdviceSection>
        <SectionHeader>
          <Shirt size={20} color="#667eea" />
          <SectionTitle>What to Pack</SectionTitle>
        </SectionHeader>
        <AdviceList>
          {advice.clothing.map((item, index) => (
            <AdviceItem key={index}>{item}</AdviceItem>
          ))}
        </AdviceList>
      </AdviceSection>

      <AdviceSection>
        <SectionHeader>
          <Lightbulb size={20} color="#667eea" />
          <SectionTitle>Travel Tips</SectionTitle>
        </SectionHeader>
        <AdviceList>
          {advice.tips.map((item, index) => (
            <AdviceItem key={index}>{item}</AdviceItem>
          ))}
        </AdviceList>
      </AdviceSection>
    </AdviceContainer>
  );
}

export default TravelAdvice;
