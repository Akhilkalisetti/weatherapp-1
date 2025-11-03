import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, TrendingUp, Droplets, Wind, CloudSun, AlertCircle } from 'lucide-react';
import { getWeatherForecast, searchLocations } from '../../services/weatherForecastService';
import { getWeatherIcon } from '../../services/weatherService';

const Container = styled.div`
  width: 100%;
`;

const SearchCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 15px;
  align-items: flex-end;
`;

const SearchGroup = styled.div`
  flex: 1;
  position: relative;
`;

const SearchLabel = styled.label`
  display: block;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const AutocompleteContainer = styled.div`
  position: relative;
`;

const AutocompleteList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const AutocompleteItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TabHeader = styled.div`
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#666'};
  cursor: pointer;
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

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const ChartTitle = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartWrapper = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  min-height: 300px;
  position: relative;
`;

const Chart = styled.svg`
  width: 100%;
  height: 300px;
  overflow: visible;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 12px;
  padding: 20px;
  color: #c33;
  text-align: center;
  margin: 20px 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
`;

const LocationInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LocationName = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const LocationDetails = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const CurrentWeather = styled.div`
  text-align: center;
`;

const CurrentTemp = styled.div`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 10px;
`;

const CurrentCondition = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
`;

function WeatherGraph() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        searchLocations(searchQuery).then(results => {
          setAutocompleteResults(results);
          setShowAutocomplete(true);
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location.displayName);
    setShowAutocomplete(false);
    loadForecast(location.name);
  };

  const loadForecast = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const forecastData = await getWeatherForecast(cityName, 7);
      setForecast(forecastData);
      setActiveTab('today');
    } catch (err) {
      setError(err.message || 'Failed to fetch weather forecast');
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedLocation) {
      loadForecast(selectedLocation.name);
    }
  };

  const renderTemperatureChart = (data) => {
    if (!data || data.length === 0) return null;

    const width = 800;
    const height = 280;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const temps = data.map(d => d.maxTemp || d.temperature || 0);
    const minTemp = Math.min(...temps) - 5;
    const maxTemp = Math.max(...temps) + 5;
    const tempRange = maxTemp - minTemp || 1;

    const mapX = (index, total) => padding + (index / (total - 1)) * chartWidth;
    const mapY = (value) => {
      const ratio = (value - minTemp) / tempRange;
      return padding + (1 - ratio) * chartHeight;
    };

    const pathData = data
      .map((d, i) => {
        const x = mapX(i, data.length);
        const y = mapY(d.maxTemp || d.temperature || 0);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <Chart viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#667eea" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding + (i / 4) * chartHeight;
          const temp = maxTemp - (i / 4) * tempRange;
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e1e5e9" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#666">{Math.round(temp)}°</text>
            </g>
          );
        })}

        {/* Area under curve */}
        <path
          d={`${pathData} L ${mapX(data.length - 1, data.length)} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
          fill="url(#tempGradient)"
        />

        {/* Line */}
        <path d={pathData} fill="none" stroke="#667eea" strokeWidth="3" />

        {/* Points */}
        {data.map((d, i) => {
          const x = mapX(i, data.length);
          const y = mapY(d.maxTemp || d.temperature || 0);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill="#667eea" />
              <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fill="#333" fontWeight="600">
                {d.maxTemp || d.temperature}°
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = mapX(i, data.length);
          return (
            <text key={i} x={x} y={height - padding + 20} textAnchor="middle" fontSize="10" fill="#666">
              {d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.time}
            </text>
          );
        })}
      </Chart>
    );
  };

  const renderHumidityChart = (data) => {
    if (!data || data.length === 0) return null;

    const width = 800;
    const height = 280;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length - 10;

    return (
      <Chart viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(humidity => {
          const y = padding + (1 - humidity / 100) * chartHeight;
          return (
            <g key={humidity}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e1e5e9" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#666">{humidity}%</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + (i * (chartWidth / data.length)) + 5;
          const humidity = d.humidity || 0;
          const barHeight = (humidity / 100) * chartHeight;
          const y = padding + chartHeight - barHeight;
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#667eea"
                rx="4"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#333"
                fontWeight="600"
              >
                {humidity}%
              </text>
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#666"
              >
                {d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.time}
              </text>
            </g>
          );
        })}
      </Chart>
    );
  };

  const renderWindSpeedChart = (data) => {
    if (!data || data.length === 0) return null;

    const width = 800;
    const height = 280;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const speeds = data.map(d => d.windSpeed || 0);
    const maxSpeed = Math.max(...speeds) + 5;

    return (
      <Chart viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding + (i / 4) * chartHeight;
          const speed = maxSpeed - (i / 4) * maxSpeed;
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e1e5e9" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#666">{Math.round(speed)}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + (i * (chartWidth / data.length)) + 5;
          const speed = d.windSpeed || 0;
          const barHeight = (speed / maxSpeed) * chartHeight;
          const y = padding + chartHeight - barHeight;
          const barWidth = chartWidth / data.length - 10;
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#10b981"
                rx="4"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#333"
                fontWeight="600"
              >
                {speed}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#666"
              >
                {d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.time}
              </text>
            </g>
          );
        })}
      </Chart>
    );
  };

  const getChartData = () => {
    if (!forecast) return [];

    switch (activeTab) {
      case 'today':
        // For today, use hourly data with temperature, or fallback to daily
        if (forecast.hourlyData && forecast.hourlyData.length > 0) {
          return forecast.hourlyData.map(h => ({
            time: h.time,
            temperature: h.temperature,
            maxTemp: h.temperature,
            humidity: h.humidity,
            windSpeed: h.windSpeed
          }));
        }
        // Fallback to first day of daily forecast for today
        return forecast.dailyForecast.slice(0, 1).map(d => ({
          date: d.date,
          maxTemp: d.maxTemp,
          temperature: d.maxTemp,
          humidity: d.humidity,
          windSpeed: d.windSpeed
        }));
      case '3day':
        return forecast.dailyForecast.slice(0, 3);
      case '7day':
        return forecast.dailyForecast.slice(0, 7);
      default:
        return [];
    }
  };

  const chartData = getChartData();

  return (
    <Container>
      <SearchCard>
        <SearchGroup>
          <SearchLabel>Search Location</SearchLabel>
          <AutocompleteContainer>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter city name..."
              onFocus={() => {
                if (autocompleteResults.length > 0) {
                  setShowAutocomplete(true);
                }
              }}
            />
            {showAutocomplete && autocompleteResults.length > 0 && (
              <AutocompleteList>
                {autocompleteResults.map((location) => (
                  <AutocompleteItem
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location.displayName}
                  </AutocompleteItem>
                ))}
              </AutocompleteList>
            )}
          </AutocompleteContainer>
        </SearchGroup>
        <SearchButton onClick={handleSearch} disabled={!selectedLocation || loading}>
          <Search size={18} />
          {loading ? 'Loading...' : 'Search'}
        </SearchButton>
      </SearchCard>

      {error && <ErrorMessage><AlertCircle size={20} style={{ display: 'inline', marginRight: '8px' }} />{error}</ErrorMessage>}

      {loading && <LoadingMessage>Loading weather data...</LoadingMessage>}

      {forecast && !loading && (
        <>
          <LocationInfo>
            <div>
              <LocationName>{forecast.location.name}, {forecast.location.country}</LocationName>
              <LocationDetails>
                {forecast.current.condition.charAt(0).toUpperCase() + forecast.current.condition.slice(1)} • 
                Humidity: {forecast.current.humidity || 'N/A'}% • 
                Wind: {forecast.current.windSpeed || 'N/A'} km/h
              </LocationDetails>
            </div>
            <CurrentWeather>
              <CurrentTemp>{forecast.current.temperature}°C</CurrentTemp>
              <CurrentCondition>
                <span>{getWeatherIcon(forecast.current.condition)}</span>
                <span>{forecast.current.condition.charAt(0).toUpperCase() + forecast.current.condition.slice(1)}</span>
              </CurrentCondition>
            </CurrentWeather>
          </LocationInfo>

          <TabContainer>
            <TabHeader>
              <Tab active={activeTab === 'today'} onClick={() => setActiveTab('today')}>
                Today
              </Tab>
              <Tab active={activeTab === '3day'} onClick={() => setActiveTab('3day')}>
                3-Day Forecast
              </Tab>
              <Tab active={activeTab === '7day'} onClick={() => setActiveTab('7day')}>
                7-Day Forecast
              </Tab>
            </TabHeader>
          </TabContainer>

          <ChartCard>
            <ChartTitle>
              <TrendingUp size={24} />
              Temperature Trend
            </ChartTitle>
            <ChartWrapper>
              {chartData.length > 0 ? renderTemperatureChart(chartData) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                  No data available for selected period
                </div>
              )}
            </ChartWrapper>
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <Droplets size={24} />
              Humidity
            </ChartTitle>
            <ChartWrapper>
              {chartData.length > 0 ? renderHumidityChart(chartData) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                  No data available for selected period
                </div>
              )}
            </ChartWrapper>
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <Wind size={24} />
              Wind Speed (km/h)
            </ChartTitle>
            <ChartWrapper>
              {chartData.length > 0 ? renderWindSpeedChart(chartData) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                  No data available for selected period
                </div>
              )}
            </ChartWrapper>
          </ChartCard>
        </>
      )}

      {!forecast && !loading && !error && (
        <LoadingMessage>
          Search for a location to view weather graphs
        </LoadingMessage>
      )}
    </Container>
  );
}

export default WeatherGraph;

