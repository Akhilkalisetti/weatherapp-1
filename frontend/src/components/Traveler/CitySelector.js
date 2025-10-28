import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, MapPin } from 'lucide-react';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 45px 15px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  size: 20px;
`;

const CityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
`;

const CityCard = styled.div`
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 2px solid ${props => props.selected ? 'transparent' : '#e1e5e9'};
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
`;

const CityName = styled.h4`
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const CountryName = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const SelectedCityInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const SelectedCityTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const SelectedCitySubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
`;

// Popular destinations data
const popularDestinations = [
  { name: 'Paris', country: 'France', code: 'FR' },
  { name: 'Tokyo', country: 'Japan', code: 'JP' },
  { name: 'New York', country: 'United States', code: 'US' },
  { name: 'London', country: 'United Kingdom', code: 'GB' },
  { name: 'Rome', country: 'Italy', code: 'IT' },
  { name: 'Sydney', country: 'Australia', code: 'AU' },
  { name: 'Barcelona', country: 'Spain', code: 'ES' },
  { name: 'Amsterdam', country: 'Netherlands', code: 'NL' },
  { name: 'Bangkok', country: 'Thailand', code: 'TH' },
  { name: 'Dubai', country: 'United Arab Emirates', code: 'AE' },
  { name: 'Singapore', country: 'Singapore', code: 'SG' },
  { name: 'Istanbul', country: 'Turkey', code: 'TR' },
  { name: 'Cairo', country: 'Egypt', code: 'EG' },
  { name: 'Mumbai', country: 'India', code: 'IN' },
  { name: 'Rio de Janeiro', country: 'Brazil', code: 'BR' },
  { name: 'Cape Town', country: 'South Africa', code: 'ZA' },
  { name: 'Vancouver', country: 'Canada', code: 'CA' },
  { name: 'Seoul', country: 'South Korea', code: 'KR' },
  { name: 'Berlin', country: 'Germany', code: 'DE' },
  { name: 'Prague', country: 'Czech Republic', code: 'CZ' }
];

function CitySelector({ onCitySelect, selectedCity }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(popularDestinations);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredCities(popularDestinations);
    } else {
      const filtered = popularDestinations.filter(
        city => 
          city.name.toLowerCase().includes(term) || 
          city.country.toLowerCase().includes(term)
      );
      setFilteredCities(filtered);
    }
  };

  const handleCitySelect = (city) => {
    onCitySelect(city);
  };

  return (
    <SelectorContainer>
      {selectedCity ? (
        <SelectedCityInfo>
          <SelectedCityTitle>
            <MapPin size={20} style={{ marginRight: '10px', display: 'inline' }} />
            {selectedCity.name}
          </SelectedCityTitle>
          <SelectedCitySubtitle>{selectedCity.country}</SelectedCitySubtitle>
        </SelectedCityInfo>
      ) : (
        <>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search for a city or country..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <SearchIcon size={20} />
          </SearchContainer>
          
          <CityGrid>
            {filteredCities.map((city, index) => (
              <CityCard
                key={index}
                selected={selectedCity && selectedCity.name === city.name}
                onClick={() => handleCitySelect(city)}
              >
                <CityName>{city.name}</CityName>
                <CountryName>{city.country}</CountryName>
              </CityCard>
            ))}
          </CityGrid>
        </>
      )}
    </SelectorContainer>
  );
}

export default CitySelector;
