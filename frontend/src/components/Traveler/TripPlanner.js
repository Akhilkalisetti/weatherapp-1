import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, MapPin, Users, Save, Trash2, Edit2, Plane, CloudSun, ThermometerSun, Wind } from 'lucide-react';
import { getWeatherForecast, searchLocations } from '../../services/weatherForecastService';
import { getWeatherIcon } from '../../services/weatherService';

const Container = styled.div`
  width: 100%;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
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
  
  &:first-child {
    border-top: 2px solid #e1e5e9;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ForecastCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const ForecastTitle = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const DayCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  text-align: center;
`;

const DayDate = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 10px;
`;

const DayIcon = styled.div`
  font-size: 2.5rem;
  margin: 10px 0;
`;

const DayTemp = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 10px 0;
`;

const DayTempRange = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
`;

const RecommendationCard = styled.div`
  background: #fff7ed;
  border: 2px solid #fed7aa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const RecommendationTitle = styled.h4`
  color: #b45309;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const RecommendationList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #b45309;
`;

const RecommendationItem = styled.li`
  margin-bottom: 8px;
`;

const TripsList = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const TripsTitle = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TripItem = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f0f0;
    transform: translateX(5px);
  }
`;

const TripInfo = styled.div`
  flex: 1;
`;

const TripDestination = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const TripDates = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const TripActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${props => props.variant === 'edit' && `
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5568d3;
    }
  `}
  
  ${props => props.variant === 'delete' && `
    background: #ff6b6b;
    color: white;
    
    &:hover {
      background: #ee5a24;
    }
  `}
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 12px;
  padding: 15px;
  color: #c33;
  margin-bottom: 20px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

function TripPlanner() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    loadSavedTrips();
  }, []);

  useEffect(() => {
    if (destination.length >= 2) {
      const timer = setTimeout(() => {
        searchLocations(destination).then(results => {
          setAutocompleteResults(results);
          setShowAutocomplete(true);
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    }
  }, [destination]);

  const loadSavedTrips = () => {
    const trips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    setSavedTrips(trips);
  };

  const saveTrip = () => {
    if (!selectedLocation || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    const trip = {
      id: editingTrip?.id || Date.now().toString(),
      destination: selectedLocation.name,
      country: selectedLocation.country,
      startDate,
      endDate,
      travelers: parseInt(travelers) || 1,
      forecast,
      createdAt: editingTrip?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      weatherAlertSent: editingTrip?.weatherAlertSent || false // Track if alert has been sent
    };

    let trips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    
    if (editingTrip) {
      trips = trips.map(t => t.id === editingTrip.id ? trip : t);
    } else {
      trips.push(trip);
    }
    
    localStorage.setItem('savedTrips', JSON.stringify(trips));
    loadSavedTrips();
    setError(null);
    
    if (editingTrip) {
      setEditingTrip(null);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setDestination(location.displayName);
    setShowAutocomplete(false);
    setAutocompleteResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLocation || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const forecastData = await getWeatherForecast(selectedLocation.name, 7);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather forecast');
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setDestination(trip.destination);
    setSelectedLocation({ name: trip.destination, country: trip.country });
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setTravelers(trip.travelers);
    setForecast(trip.forecast);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const trips = savedTrips.filter(t => t.id !== tripId);
      localStorage.setItem('savedTrips', JSON.stringify(trips));
      
      // Delete associated alerts for this trip
      const alerts = JSON.parse(localStorage.getItem('tripWeatherAlerts') || '[]');
      const updatedAlerts = alerts.filter(alert => alert.tripId !== tripId);
      localStorage.setItem('tripWeatherAlerts', JSON.stringify(updatedAlerts));
      
      loadSavedTrips();
      
      if (editingTrip?.id === tripId) {
        setEditingTrip(null);
        setDestination('');
        setSelectedLocation(null);
        setStartDate('');
        setEndDate('');
        setTravelers(1);
        setForecast(null);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Container>
      <FormCard>
        <FormTitle>
          <Plane size={24} />
          Plan Your Trip
        </FormTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>
                <MapPin size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Destination *
              </Label>
              <AutocompleteContainer>
                <Input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search for a city..."
                  required
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
            </FormGroup>

            <FormGroup>
              <Label>
                <Calendar size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Start Date *
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Calendar size={16} style={{ display: 'inline', marginRight: '5px' }} />
                End Date *
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Users size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Number of Travelers
              </Label>
              <Input
                type="number"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                min="1"
                placeholder="1"
              />
            </FormGroup>
          </FormGrid>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Loading Forecast...' : 'Get Weather Forecast'}
          </SubmitButton>
        </form>
      </FormCard>

      {forecast && (
        <ForecastCard>
          <ForecastTitle>
            <CloudSun size={24} />
            Weather Forecast for {forecast.location.name}, {forecast.location.country}
          </ForecastTitle>

          <ForecastGrid>
            {forecast.dailyForecast.map((day, index) => (
              <DayCard key={index}>
                <DayDate>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</DayDate>
                <DayIcon>{getWeatherIcon(day.condition)}</DayIcon>
                <DayTemp>{day.maxTemp}°C</DayTemp>
                <DayTempRange>{day.minTemp}°C / {day.maxTemp}°C</DayTempRange>
                <div style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.9 }}>
                  <div><Wind size={12} style={{ display: 'inline', marginRight: '4px' }} /> {day.windSpeed} km/h</div>
                </div>
              </DayCard>
            ))}
          </ForecastGrid>

          {forecast.recommended && (
            <RecommendationCard>
              <RecommendationTitle>💡 Travel Recommendations</RecommendationTitle>
              <RecommendationList>
                <RecommendationItem>
                  <strong>Best Weather Days:</strong> {forecast.recommended.bestDays.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')}
                </RecommendationItem>
                <RecommendationItem>
                  <strong>Average Temperature:</strong> {forecast.recommended.averageTemp}°C
                </RecommendationItem>
                <RecommendationItem>
                  <strong>Temperature Range:</strong> {forecast.recommended.tempRange.min}°C - {forecast.recommended.tempRange.max}°C
                </RecommendationItem>
                <RecommendationItem>
                  <strong>Overall Condition:</strong> {forecast.recommended.overallCondition.charAt(0).toUpperCase() + forecast.recommended.overallCondition.slice(1)}
                </RecommendationItem>
              </RecommendationList>
            </RecommendationCard>
          )}

          <SubmitButton
            onClick={saveTrip}
            style={{ marginTop: '20px', background: '#10b981' }}
          >
            <Save size={20} />
            {editingTrip ? 'Update Trip' : 'Save Trip'}
          </SubmitButton>
        </ForecastCard>
      )}

      {savedTrips.length > 0 && (
        <TripsList>
          <TripsTitle>Your Saved Trips</TripsTitle>
          {savedTrips.map((trip) => (
            <TripItem key={trip.id}>
              <TripInfo>
                <TripDestination>{trip.destination}</TripDestination>
                <TripDates>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)} • {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
                </TripDates>
              </TripInfo>
              <TripActions>
                <ActionButton variant="edit" onClick={() => handleEdit(trip)}>
                  <Edit2 size={16} />
                  Edit
                </ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(trip.id)}>
                  <Trash2 size={16} />
                  Delete
                </ActionButton>
              </TripActions>
            </TripItem>
          ))}
        </TripsList>
      )}
    </Container>
  );
}

export default TripPlanner;

