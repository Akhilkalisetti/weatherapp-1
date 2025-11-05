import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Building, Users, CheckCircle, XCircle, Clock, AlertTriangle, MapPin, Calendar, FileText, MessageSquare, LogOut, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { weatherAbsenceAPI } from '../../services/api';
import EmployeeMessageCenter from './EmployeeMessageCenter';
import toast from 'react-hot-toast';

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

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: ${props => props.color || '#667eea'};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
`;

const RequestsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const RequestsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const RequestsTitle = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? '#667eea' : '#e1e5e9'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#667eea' : '#f0f4ff'};
  }
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
  border-radius: 16px;
  padding: 25px;
  background: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const EmployeeName = styled.h3`
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 1.2rem;
  font-weight: 600;
`;

const RequestMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #6b7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 25px;
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
  margin: 15px 0;
  color: #4b5563;
  line-height: 1.6;
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const WeatherVerification = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
`;

const VerificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #0369a1;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`;

const WeatherItem = styled.div`
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const WeatherIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 6px;
`;

const WeatherLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 4px;
`;

const WeatherValue = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.variant === 'approve') {
      return `
        background: #10b981;
        color: white;
        &:hover {
          background: #059669;
          transform: translateY(-1px);
        }
      `;
    } else if (props.variant === 'reject') {
      return `
        background: #ef4444;
        color: white;
        &:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: #6b7280;
        color: white;
        &:hover {
          background: #4b5563;
          transform: translateY(-1px);
        }
      `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CommentSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  margin-bottom: 10px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CommentButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: #5a67d8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 1.3rem;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 1rem;
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

function CompanyDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [comments, setComments] = useState({});

  useEffect(() => {
    // Load requests from backend API
    const loadRequests = async () => {
      try {
        const absenceRequests = await weatherAbsenceAPI.getAll();
        setRequests(absenceRequests);
        console.log('✅ Loaded', absenceRequests.length, 'absence requests from backend');
      } catch (error) {
        console.error('❌ Error loading absence requests:', error.message);
        setRequests([]);
      }
    };

    loadRequests();

    // Load comments from localStorage
    const savedComments = localStorage.getItem('requestComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  }).map(request => ({ ...request, id: request._id || request.id }));

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // Call backend API to update status
      await weatherAbsenceAPI.update(requestId, { 
        status: newStatus,
        comment: comments[requestId] || ''
      });
      
      // Reload from backend
      const absenceRequests = await weatherAbsenceAPI.getAll();
      setRequests(absenceRequests);
      
      const statusText = newStatus === 'approved' ? 'approved' : 'rejected';
      toast.success(`Request ${statusText} successfully!`);
      console.log('✅ Request', statusText);
    } catch (error) {
      console.error('❌ Error updating request status:', error.message);
      toast.error('Failed to update request status');
    }
  };

  const handleCommentSubmit = (requestId) => {
    const comment = comments[requestId];
    if (!comment || !comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            comment: comment,
            commentedAt: new Date().toISOString()
          }
        : request
    );
    
    setRequests(updatedRequests);
    localStorage.setItem('weatherAbsenceRequests', JSON.stringify(updatedRequests));
    
    // Clear the comment input
    setComments(prev => ({ ...prev, [requestId]: '' }));
    toast.success('Comment added successfully!');
  };

  const handleCommentChange = (requestId, value) => {
    setComments(prev => ({ ...prev, [requestId]: value }));
  };

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

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardContainer>
      <Header>
        <HeaderInfo>
          <HeaderTitle>
            <Building size={32} />
            Company Dashboard
          </HeaderTitle>
        </HeaderInfo>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </LogoutButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#667eea">
            <Users size={40} />
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Requests</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#f59e0b">
            <Clock size={40} />
          </StatIcon>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#10b981">
            <CheckCircle size={40} />
          </StatIcon>
          <StatValue>{stats.approved}</StatValue>
          <StatLabel>Approved</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#ef4444">
            <XCircle size={40} />
          </StatIcon>
          <StatValue>{stats.rejected}</StatValue>
          <StatLabel>Rejected</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <TabHeader>
          <Tab 
            active={activeTab === 'requests'} 
            onClick={() => setActiveTab('requests')}
          >
            <FileText size={20} />
            Absence Requests
          </Tab>
          <Tab 
            active={activeTab === 'messages'} 
            onClick={() => setActiveTab('messages')}
          >
            <Send size={20} />
            Message Center
          </Tab>
        </TabHeader>

        <TabContent>
          {activeTab === 'requests' && (
      <RequestsContainer>
        <RequestsHeader>
          <RequestsTitle>
            <AlertTriangle size={24} />
            Weather Absence Requests
          </RequestsTitle>
          <FilterButtons>
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All ({stats.total})
            </FilterButton>
            <FilterButton 
              active={filter === 'pending'} 
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pending})
            </FilterButton>
            <FilterButton 
              active={filter === 'approved'} 
              onClick={() => setFilter('approved')}
            >
              Approved ({stats.approved})
            </FilterButton>
            <FilterButton 
              active={filter === 'rejected'} 
              onClick={() => setFilter('rejected')}
            >
              Rejected ({stats.rejected})
            </FilterButton>
          </FilterButtons>
        </RequestsHeader>

        {filteredRequests.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyTitle>No Requests Found</EmptyTitle>
            <EmptyDescription>
              {filter === 'all' 
                ? 'No weather absence requests have been submitted yet.'
                : `No ${filter} requests found.`
              }
            </EmptyDescription>
          </EmptyState>
        ) : (
          <RequestList>
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} status={request.status}>
                <RequestHeader>
                  <RequestInfo>
                    <EmployeeName>{request.employeeName}</EmployeeName>
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

                <RequestDescription>
                  <strong>Weather Issue:</strong> {request.description}
                </RequestDescription>

                {request.verificationResult && (
                  <WeatherVerification>
                    <VerificationHeader>
                      <AlertTriangle size={20} />
                      Weather Verification Results
                    </VerificationHeader>
                    
                    <div style={{ 
                      marginBottom: '15px',
                      padding: '10px',
                      borderRadius: '6px',
                      background: request.verificationResult.isVerified ? '#ecfdf5' : '#fef3c7',
                      color: request.verificationResult.isVerified ? '#059669' : '#d97706',
                      border: `1px solid ${request.verificationResult.isVerified ? '#a7f3d0' : '#fde68a'}`
                    }}>
                      <strong>
                        {request.verificationResult.isVerified ? '✅ VERIFIED' : '⚠️ UNDER REVIEW'}: 
                      </strong> {request.verificationResult.isVerified 
                        ? 'Severe weather conditions detected' 
                        : 'Weather appears normal, manual review required'
                      }
                    </div>

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
                      <div style={{ marginTop: '15px' }}>
                        <strong>Weather Alerts:</strong>
                        {request.verificationResult.weatherData.alerts.map((alert, index) => (
                          <div key={index} style={{ 
                            marginTop: '8px', 
                            padding: '8px 12px', 
                            background: '#f3f4f6', 
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                          }}>
                            <strong>{alert.type.toUpperCase()}:</strong> {alert.message} ({alert.time})
                          </div>
                        ))}
                      </div>
                    )}
                  </WeatherVerification>
                )}

                {request.status === 'pending' && (
                  <ActionButtons>
                    <ActionButton
                      variant="approve"
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </ActionButton>
                    <ActionButton
                      variant="reject"
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    >
                      <XCircle size={16} />
                      Reject
                    </ActionButton>
                  </ActionButtons>
                )}

                <CommentSection>
                  <CommentInput
                    placeholder="Add a comment or feedback for this request..."
                    value={comments[request.id] || ''}
                    onChange={(e) => handleCommentChange(request.id, e.target.value)}
                  />
                  <CommentButton onClick={() => handleCommentSubmit(request.id)}>
                    <MessageSquare size={16} />
                    Add Comment
                  </CommentButton>
                  
                  {request.comment && (
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '12px', 
                      background: '#f9fafb', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <strong>Company Comment:</strong> {request.comment}
                      {request.commentedAt && (
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                          Added on {formatDate(request.commentedAt)}
                        </div>
                      )}
                    </div>
                  )}
                </CommentSection>
              </RequestCard>
            ))}
          </RequestList>
        )}
      </RequestsContainer>
          )}

          {activeTab === 'messages' && (
            <EmployeeMessageCenter />
          )}
        </TabContent>
      </TabContainer>
    </DashboardContainer>
  );
}

export default CompanyDashboard;
