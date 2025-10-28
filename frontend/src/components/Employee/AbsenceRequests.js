import React from 'react';
import styled from 'styled-components';
import { Clock, CheckCircle, XCircle, AlertTriangle, MapPin, Calendar, FileText, Image as ImageIcon } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RequestCard = styled.div`
  border: 2px solid ${props => {
    if (props.status === 'approved') return '#10b981';
    if (props.status === 'rejected') return '#ef4444';
    return '#f59e0b';
  }};
  border-radius: 12px;
  padding: 20px;
  background: ${props => {
    if (props.status === 'approved') return '#ecfdf5';
    if (props.status === 'rejected') return '#fef2f2';
    return '#fffbeb';
  }};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const RequestTitle = styled.h4`
  margin: 0 0 5px 0;
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
`;

const RequestMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #6b7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    if (props.status === 'approved') return '#10b981';
    if (props.status === 'rejected') return '#ef4444';
    return '#f59e0b';
  }};
  color: white;
`;

const RequestDescription = styled.p`
  margin: 10px 0;
  color: #4b5563;
  line-height: 1.5;
`;

const WeatherInfo = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  border: 1px solid #e5e7eb;
`;

const WeatherHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #374151;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

const WeatherItem = styled.div`
  text-align: center;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
`;

const WeatherIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 4px;
`;

const WeatherLabel = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  margin-bottom: 2px;
`;

const WeatherValue = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const ImageContainer = styled.div`
  margin-top: 15px;
  text-align: center;
`;

const RequestImage = styled.img`
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: #667eea;
  }
`;

const NoImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 1.1rem;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const VerificationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => props.verified ? '#ecfdf5' : '#fef3c7'};
  color: ${props => props.verified ? '#059669' : '#d97706'};
  border: 1px solid ${props => props.verified ? '#a7f3d0' : '#fde68a'};
`;

function AbsenceRequests({ requests, onDelete }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'sunny': '☀️',
      'cloudy': '☁️',
      'partly-cloudy': '⛅',
      'rainy': '🌧️',
      'stormy': '⛈️'
    };
    return icons[condition] || '🌤️';
  };

  const getWeatherDescription = (condition) => {
    const descriptions = {
      'sunny': 'Sunny',
      'cloudy': 'Cloudy',
      'partly-cloudy': 'Partly Cloudy',
      'rainy': 'Rainy',
      'stormy': 'Stormy'
    };
    return descriptions[condition] || 'Unknown';
  };

  if (!requests || requests.length === 0) {
    return (
      <Container>
        <Title>
          <Clock size={24} />
          Weather Absence Requests
        </Title>
        <EmptyState>
          <EmptyIcon>🌤️</EmptyIcon>
          <EmptyTitle>No Weather Reports Yet</EmptyTitle>
          <EmptyDescription>
            Submit your first weather absence report to get started.
          </EmptyDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <Clock size={24} />
        Weather Absence Requests ({requests.length})
      </Title>
      
      <RequestList>
        {requests.map((request) => (
          <RequestCard key={request.id} status={request.status}>
            <RequestHeader>
              <RequestInfo>
                <RequestTitle>
                  Weather Absence Report - {request.employeeName}
                </RequestTitle>
                <RequestMeta>
                  <MetaItem>
                    <MapPin size={14} />
                    {request.location}
                  </MetaItem>
                  <MetaItem>
                    <Calendar size={14} />
                    {formatDate(request.submittedAt)}
                  </MetaItem>
                  <MetaItem>
                    <FileText size={14} />
                    ID: {request.employeeId}
                  </MetaItem>
                </RequestMeta>
              </RequestInfo>
              <StatusBadge status={request.status}>
                {getStatusIcon(request.status)}
                {request.status}
              </StatusBadge>
            </RequestHeader>

            {request.description && (
              <RequestDescription>
                <strong>Description:</strong> {request.description}
              </RequestDescription>
            )}

            {request.verificationResult && (
              <WeatherInfo>
                <WeatherHeader>
                  <AlertTriangle size={16} />
                  Weather Verification Results
                </WeatherHeader>
                
                <VerificationStatus verified={request.verificationResult.isVerified}>
                  {request.verificationResult.isVerified ? (
                    <>
                      <CheckCircle size={16} />
                      Weather condition verified - Severe weather detected
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} />
                      Weather appears normal - Under review
                    </>
                  )}
                </VerificationStatus>

                <WeatherDetails>
                  <WeatherItem>
                    <WeatherIcon>{getWeatherIcon(request.verificationResult.weatherData.condition)}</WeatherIcon>
                    <WeatherLabel>Condition</WeatherLabel>
                    <WeatherValue>{getWeatherDescription(request.verificationResult.weatherData.condition)}</WeatherValue>
                  </WeatherItem>
                  <WeatherItem>
                    <WeatherLabel>Temperature</WeatherLabel>
                    <WeatherValue>{request.verificationResult.weatherData.temperature}°C</WeatherValue>
                  </WeatherItem>
                  <WeatherItem>
                    <WeatherLabel>Humidity</WeatherLabel>
                    <WeatherValue>{request.verificationResult.weatherData.humidity}%</WeatherValue>
                  </WeatherItem>
                  <WeatherItem>
                    <WeatherLabel>Wind Speed</WeatherLabel>
                    <WeatherValue>{request.verificationResult.weatherData.windSpeed} km/h</WeatherValue>
                  </WeatherItem>
                </WeatherDetails>

                {request.verificationResult.weatherData.alerts && 
                 request.verificationResult.weatherData.alerts.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Weather Alerts:</strong>
                    {request.verificationResult.weatherData.alerts.map((alert, index) => (
                      <div key={index} style={{ 
                        marginTop: '5px', 
                        padding: '6px 8px', 
                        background: '#f3f4f6', 
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        <strong>{alert.type.toUpperCase()}:</strong> {alert.message} ({alert.time})
                      </div>
                    ))}
                  </div>
                )}
              </WeatherInfo>
            )}

            {request.imagePreview && (
              <ImageContainer>
                <RequestImage 
                  src={request.imagePreview} 
                  alt="Weather condition" 
                  onClick={() => window.open(request.imagePreview, '_blank')}
                />
              </ImageContainer>
            )}

            {!request.imagePreview && (
              <ImageContainer>
                <NoImagePlaceholder>
                  <ImageIcon size={20} />
                  No image uploaded
                </NoImagePlaceholder>
              </ImageContainer>
            )}
          </RequestCard>
        ))}
      </RequestList>
    </Container>
  );
}

export default AbsenceRequests;
