import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, X, Check, Trash2, MapPin, Calendar, CloudSun, XCircle } from 'lucide-react';
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, deleteAlert, deleteAllAlerts, getUnreadAlertsCount } from '../../services/tripAlertService';
import { getWeatherIcon } from '../../services/weatherService';

const NotificationBell = styled.button`
  position: relative;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  border: 2px solid white;
`;

const AlertsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  
  @media (max-width: 768px) {
    width: 350px;
    right: -50px;
  }
  
  @media (max-width: 480px) {
    width: calc(100vw - 40px);
    right: -100px;
  }
`;

const AlertsHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  z-index: 10;
`;

const AlertsTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const AlertsList = styled.div`
  padding: 10px;
  overflow-y: auto;
  flex: 1;
`;

const AlertItem = styled.div`
  background: ${props => props.read ? '#f8f9fa' : '#fff7ed'};
  border: 1px solid ${props => props.read ? '#e1e5e9' : '#fed7aa'};
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const AlertDestination = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 5px;
`;

const AlertIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;

const AlertSummary = styled.div`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const AlertDetails = styled.div`
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #999;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${props => props.read ? '#e1e5e9' : '#fed7aa'};
`;

const AlertDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
`;

const WeatherTemp = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
`;

const WeatherCondition = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #666;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 12px;
  height: 12px;
`;

function TripWeatherAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    loadAlerts();
    // Check for alerts immediately on mount
    checkAlerts();
    
    // Check for new alerts every 30 minutes (runs even when tab is not active)
    const interval = setInterval(() => {
      checkAlerts();
    }, 30 * 60 * 1000); // 30 minutes
    
    // Also check daily at midnight (check every hour and see if date changed)
    const dailyCheckInterval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() < 5) {
        checkAlerts();
      }
    }, 60 * 60 * 1000); // Every hour
    
    return () => {
      clearInterval(interval);
      clearInterval(dailyCheckInterval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const loadAlerts = () => {
    const allAlerts = getAlerts();
    setAlerts(allAlerts);
    setUnreadCount(getUnreadAlertsCount());
  };

  const checkAlerts = async () => {
    const { checkUpcomingTrips } = await import('../../services/tripAlertService');
    await checkUpcomingTrips();
    loadAlerts();
  };

  const handleMarkAsRead = (alertId) => {
    markAlertAsRead(alertId);
    loadAlerts();
  };

  const handleMarkAllAsRead = () => {
    markAllAlertsAsRead();
    loadAlerts();
  };

  const handleDelete = (alertId) => {
    deleteAlert(alertId);
    loadAlerts();
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all alerts?')) {
      deleteAllAlerts();
      loadAlerts();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <NotificationBell onClick={() => setShowDropdown(!showDropdown)}>
        <Bell size={24} />
        {unreadCount > 0 && <Badge>{unreadCount > 9 ? '9+' : unreadCount}</Badge>}
      </NotificationBell>

      {showDropdown && (
        <AlertsDropdown>
          <AlertsHeader>
            <AlertsTitle>
              <Bell size={20} />
              Trip Weather Alerts
              {unreadCount > 0 && <span style={{ fontSize: '0.85rem', color: '#667eea', fontWeight: 'normal' }}>({unreadCount} new)</span>}
            </AlertsTitle>
            <HeaderActions>
              {alerts.length > 0 && (
                <>
                  {unreadCount > 0 && (
                    <ActionButton onClick={handleMarkAllAsRead}>
                      <Check size={16} style={{ display: 'inline', marginRight: '4px' }} />
                      Mark all read
                    </ActionButton>
                  )}
                  <ActionButton onClick={handleDeleteAll} style={{ color: '#ff6b6b' }}>
                    <Trash2 size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    Clear all
                  </ActionButton>
                </>
              )}
              <ActionButton onClick={() => setShowDropdown(false)}>
                <X size={18} />
              </ActionButton>
            </HeaderActions>
          </AlertsHeader>

          <AlertsList>
            {alerts.length === 0 ? (
              <EmptyState>
                <Bell size={48} style={{ margin: '0 auto 15px', opacity: 0.3 }} />
                <div>No trip alerts yet</div>
                <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>Alerts will appear here one day before your trips</div>
              </EmptyState>
            ) : (
              alerts.map((alert) => (
                <AlertItem key={alert.id} read={alert.read}>
                  {!alert.read && <UnreadBadge />}
                  
                  <AlertHeader>
                    <AlertDestination>
                      <MapPin size={16} color="#667eea" />
                      {alert.destination}
                    </AlertDestination>
                    <AlertActions>
                      {!alert.read && (
                        <AlertIconButton onClick={() => handleMarkAsRead(alert.id)} title="Mark as read">
                          <Check size={16} />
                        </AlertIconButton>
                      )}
                      <AlertIconButton onClick={() => handleDelete(alert.id)} title="Delete">
                        <Trash2 size={16} />
                      </AlertIconButton>
                    </AlertActions>
                  </AlertHeader>

                  <AlertSummary>{alert.summary}</AlertSummary>

                  {alert.forecast && !alert.error && (
                    <WeatherInfo>
                      <WeatherTemp>{alert.forecast.maxTemp}°C</WeatherTemp>
                      <WeatherCondition>
                        <span style={{ fontSize: '1.5rem' }}>{getWeatherIcon(alert.forecast.condition)}</span>
                        <span>{alert.forecast.condition.charAt(0).toUpperCase() + alert.forecast.condition.slice(1).replace('-', ' ')}</span>
                      </WeatherCondition>
                    </WeatherInfo>
                  )}

                  <AlertDetails read={alert.read}>
                    <AlertDetailItem>
                      <Calendar size={14} />
                      Trip starts: {formatDate(alert.startDate)}
                    </AlertDetailItem>
                  </AlertDetails>
                </AlertItem>
              ))
            )}
          </AlertsList>
        </AlertsDropdown>
      )}
    </div>
  );
}

export default TripWeatherAlerts;

