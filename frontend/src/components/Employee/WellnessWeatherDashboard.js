import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  AlertTriangle, Search, MapPin, RefreshCw, LogOut, Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getWellnessData, getAQIColor, getUVRisk } from '../../services/wellnessService';
import AQIVisualization from './WellnessComponents/AQIVisualization';
import UVIndexChart from './WellnessComponents/UVIndexChart';
import PollenCountChart from './WellnessComponents/PollenCountChart';
import TemperatureTrends from './WellnessComponents/TemperatureTrends';
import PersonalizedTips from './WellnessComponents/PersonalizedTips';

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

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
`;

const HeaderTitle = styled.h1`
  color: #333;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const RefreshButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
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

const CurrentLocation = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LocationIcon = styled(MapPin)`
  color: #667eea;
`;

const LocationInfo = styled.div`
  flex: 1;
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.3rem;
  }
  p {
    margin: 5px 0 0 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const VisualizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #667eea;
  font-size: 1.2rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: #c33;
  margin: 20px 0;
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const QuickStatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${props => props.color || '#667eea'};
`;

const QuickStatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color || '#667eea'};
  margin-bottom: 5px;
`;

const QuickStatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
`;

function WellnessWeatherDashboard() {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('Tokyo');
  const [currentLocation, setCurrentLocation] = useState('Tokyo');
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWellnessData(currentLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWellnessData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWellnessData(city);
      setWellnessData(data);
    } catch (err) {
      console.error('Error loading wellness data:', err);
      setError('Failed to load wellness data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentLocation(searchQuery.trim());
      loadWellnessData(searchQuery.trim());
    }
  };

  const handleRefresh = () => {
    loadWellnessData(currentLocation);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getQuickStats = () => {
    if (!wellnessData) return [];
    
    const aqiColor = getAQIColor(wellnessData.airQuality.aqi);
    const uvRisk = getUVRisk(wellnessData.uvIndex.current);
    
    return [
      {
        label: 'AQI',
        value: wellnessData.airQuality.aqi,
        color: aqiColor.color,
        category: aqiColor.risk
      },
      {
        label: 'UV Index',
        value: wellnessData.uvIndex.current,
        color: uvRisk.color,
        category: uvRisk.risk
      },
      {
        label: 'Temperature',
        value: `${wellnessData.temperature.current}°C`,
        color: '#667eea',
        category: 'Current'
      },
      {
        label: 'Pollens',
        value: Math.max(
          wellnessData.pollen.grass,
          wellnessData.pollen.trees,
          wellnessData.pollen.weeds
        ),
        color: '#f59e0b',
        category: 'Highest'
      }
    ];
  };

  return (
    <DashboardContainer>
      <Header>
        <HeaderInfo>
          <HeaderTitle>
            <Heart size={32} />
            Wellness Weather Dashboard
          </HeaderTitle>
        </HeaderInfo>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search company or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>
            <Search size={20} />
            Search
          </SearchButton>
          <RefreshButton onClick={handleRefresh} title="Refresh Data">
            <RefreshCw size={20} />
          </RefreshButton>
        </SearchContainer>
        <LogoutButton onClick={logout}>
          <LogOut size={20} />
          Logout
        </LogoutButton>
      </Header>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginLeft: '15px' }}>Loading wellness data...</div>
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>
          <AlertTriangle size={24} style={{ marginBottom: '10px' }} />
          <div>{error}</div>
        </ErrorMessage>
      ) : wellnessData ? (
        <>
          <CurrentLocation>
            <LocationIcon size={32} />
            <LocationInfo>
              <h3>{currentLocation}</h3>
              <p>Health & Wellness Weather Portal - Last updated: {new Date().toLocaleTimeString()}</p>
            </LocationInfo>
          </CurrentLocation>

          <QuickStats>
            {getQuickStats().map((stat, index) => (
              <QuickStatCard key={index} color={stat.color}>
                <QuickStatValue color={stat.color}>{stat.value}</QuickStatValue>
                <QuickStatLabel>{stat.label}</QuickStatLabel>
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                  {stat.category}
                </div>
              </QuickStatCard>
            ))}
          </QuickStats>

          <VisualizationGrid>
            <Card>
              <AQIVisualization airQuality={wellnessData.airQuality} />
            </Card>
            
            <Card>
              <UVIndexChart uvData={wellnessData.uvIndex} />
            </Card>
          </VisualizationGrid>

          <VisualizationGrid>
            <Card>
              <PollenCountChart pollenData={wellnessData.pollen} />
            </Card>
            
            <Card>
              <TemperatureTrends tempData={wellnessData.temperature} />
            </Card>
          </VisualizationGrid>

          <Card>
            <PersonalizedTips tips={wellnessData.tips} />
          </Card>
        </>
      ) : null}
    </DashboardContainer>
  );
}

export default WellnessWeatherDashboard;

