import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Plane, MapPin, Camera, AlertCircle, Sun, Image, CheckSquare, DollarSign, Phone } from 'lucide-react';
import CitySelector from './CitySelector';
import TravelAdvice from './TravelAdvice';
import WeatherAlerts from './WeatherAlerts';
import MemoryForm from './MemoryForm';
import MemoryGrid from './MemoryGrid';
import Gallery from './Gallery';
import TravelChecklist from './TravelChecklist';
import CurrencyConverter from './CurrencyConverter';
import EmergencyInfo from './EmergencyInfo';
import { getWeatherData } from '../../services/weatherService';
import { getCountryInfo } from '../../services/countryService';
import { memoryAPI } from '../../services/api';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #667eea;
`;

const UserDetails = styled.div`
  h2 {
    color: #333;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  p {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
  }
`;

const TabContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin-bottom: 30px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TabHeader = styled.div`
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
`;

const Tab = styled.button`
  flex: 1;
  padding: 20px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#666'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.active ? 'white' : '#f0f0f0'};
  }
  
  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `}
`;

const TabContent = styled.div`
  padding: 30px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

function TravelerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    // Load memories from backend API
    const loadMemories = async () => {
      try {
        const memoriesData = await memoryAPI.getAll();
        console.log('✅ Loaded', memoriesData.length, 'memories from backend');
        
        // Map backend _id to id for compatibility
        const memoriesWithId = memoriesData.map(m => ({ ...m, id: m._id }));
        setMemories(memoriesWithId);
      } catch (error) {
        console.error('❌ Error loading memories:', error.message);
        // Don't show alert on initial load, just log it
        setMemories([]);
      }
    };
    
    loadMemories();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      // Fetch weather data and country info
      const fetchData = async () => {
        try {
          const [weather, country] = await Promise.all([
            getWeatherData(selectedCity.name),
            getCountryInfo(selectedCity.country)
          ]);
          setWeatherData(weather);
          setCountryInfo(country);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      fetchData();
    }
  }, [selectedCity]);

  const handleLogout = () => {
    logout();
  };

  const addMemory = async (memory) => {
    try {
      // Memory is already saved in backend by MemoryForm
      // Reload all memories from backend to ensure consistency
      const memoriesData = await memoryAPI.getAll();
      const memoriesWithId = memoriesData.map(m => ({ ...m, id: m._id }));
      setMemories(memoriesWithId);
      console.log('✅ Memory added. Total:', memoriesWithId.length);
    } catch (error) {
      console.error('❌ Error adding memory:', error.message);
    }
  };

  const deleteMemory = async (memoryId) => {
    try {
      await memoryAPI.delete(memoryId);
      
      // Reload all memories from backend to ensure consistency
      const memoriesData = await memoryAPI.getAll();
      const memoriesWithId = memoriesData.map(m => ({ ...m, id: m._id }));
      setMemories(memoriesWithId);
      console.log('✅ Memory deleted. Total:', memoriesWithId.length);
    } catch (error) {
      console.error('❌ Error deleting memory:', error.message);
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <UserInfo>
          <Avatar src={user.avatar} alt={user.name} />
          <UserDetails>
            <h2>Welcome, {user.name}!</h2>
            <p>Ready for your next adventure?</p>
          </UserDetails>
        </UserInfo>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </LogoutButton>
      </Header>

      <TabContainer>
        <TabHeader>
          <Tab 
            active={activeTab === 'explore'} 
            onClick={() => setActiveTab('explore')}
          >
            <MapPin size={20} />
            Explore
          </Tab>
          <Tab 
            active={activeTab === 'memories'} 
            onClick={() => setActiveTab('memories')}
          >
            <Camera size={20} />
            Memories
          </Tab>
          <Tab 
            active={activeTab === 'gallery'} 
            onClick={() => setActiveTab('gallery')}
          >
            <Image size={20} />
            Gallery
          </Tab>
          <Tab 
            active={activeTab === 'weather'} 
            onClick={() => setActiveTab('weather')}
          >
            <Sun size={20} />
            Weather
          </Tab>
        </TabHeader>

        <TabContent>
          {activeTab === 'explore' && (
            <>
              <ContentGrid columns="1fr 1fr 1fr">
                <Card>
                  <CardTitle>
                    <MapPin size={24} />
                    Select Destination
                  </CardTitle>
                  <CitySelector 
                    onCitySelect={setSelectedCity}
                    selectedCity={selectedCity}
                  />
                </Card>
                
                <Card>
                  <CardTitle>
                    <DollarSign size={24} />
                    Currency Converter
                  </CardTitle>
                  <CurrencyConverter />
                </Card>
                
                <Card>
                  <CardTitle>
                    <Phone size={24} />
                    Emergency Info
                  </CardTitle>
                  <EmergencyInfo />
                </Card>
              </ContentGrid>
              
              {selectedCity && (
                <Card style={{ marginTop: '30px' }}>
                  <CardTitle>
                    <Plane size={24} />
                    Travel Advice for {selectedCity.name}
                  </CardTitle>
                  <TravelAdvice 
                    city={selectedCity}
                    countryInfo={countryInfo}
                  />
                </Card>
              )}
              
              <ContentGrid columns="1fr">
                <Card style={{ marginTop: selectedCity ? '30px' : '0' }}>
                  <CardTitle>
                    <CheckSquare size={24} />
                    Travel Checklist
                  </CardTitle>
                  <TravelChecklist />
                </Card>
              </ContentGrid>
            </>
          )}

          {activeTab === 'memories' && (
            <ContentGrid>
              <Card>
                <CardTitle>
                  <Camera size={24} />
                  Add Memory
                </CardTitle>
                <MemoryForm onSubmit={addMemory} />
              </Card>
              
              <Card>
                <CardTitle>
                  <Camera size={24} />
                  Your Memories
                </CardTitle>
                <MemoryGrid 
                  memories={memories}
                  onDelete={deleteMemory}
                />
              </Card>
            </ContentGrid>
          )}

          {activeTab === 'gallery' && (
            <Gallery memories={memories} />
          )}

          {activeTab === 'weather' && (
            <Card>
              <CardTitle>
                <AlertCircle size={24} />
                Weather Alerts
              </CardTitle>
              <WeatherAlerts 
                selectedCity={selectedCity}
                weatherData={weatherData}
              />
            </Card>
          )}
        </TabContent>
      </TabContainer>
    </DashboardContainer>
  );
}

export default TravelerDashboard;
