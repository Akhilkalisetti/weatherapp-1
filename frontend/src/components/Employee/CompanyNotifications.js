import React from 'react';
import styled from 'styled-components';
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
`;

const NotificationCard = styled.div`
  background: ${props => props.read ? '#f8f9fa' : 'white'};
  border: 2px solid ${props => props.read ? '#e1e5e9' : '#667eea'};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  ${props => !props.read && `
    &::before {
      content: '';
      position: absolute;
      left: -2px;
      top: 20px;
      bottom: 20px;
      width: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  `}
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 10px;
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.type) {
      case 'info': return '#e3f2fd';
      case 'warning': return '#fff3e0';
      case 'alert': return '#ffebee';
      case 'reminder': return '#f3e5f5';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'info': return '#1976d2';
      case 'warning': return '#f57c00';
      case 'alert': return '#d32f2f';
      case 'reminder': return '#7b1fa2';
      default: return '#666';
    }
  }};
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
`;

const NotificationMessage = styled.p`
  margin: 0 0 10px 0;
  color: #666;
  line-height: 1.5;
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #999;
`;

const NotificationDate = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReadStatus = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.read ? '#28a745' : '#667eea'};
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const getNotificationIcon = (type) => {
  switch (type) {
    case 'info': return <Info size={20} />;
    case 'warning': return <AlertTriangle size={20} />;
    case 'alert': return <Bell size={20} />;
    case 'reminder': return <Clock size={20} />;
    default: return <Bell size={20} />;
  }
};

const formatNotificationDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

function CompanyNotifications({ notifications, onMarkAsRead }) {
  if (!notifications || notifications.length === 0) {
    return (
      <EmptyState>
        <Bell size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
        <p>No notifications at this time</p>
      </EmptyState>
    );
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <NotificationsContainer>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          read={notification.read}
          onClick={() => handleNotificationClick(notification)}
        >
          <NotificationHeader>
            <NotificationIcon type={notification.type}>
              {getNotificationIcon(notification.type)}
            </NotificationIcon>
            <NotificationContent>
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationMessage>{notification.message}</NotificationMessage>
              <NotificationMeta>
                <NotificationDate>
                  <Clock size={14} />
                  {formatNotificationDate(notification.date)}
                </NotificationDate>
                <ReadStatus read={notification.read}>
                  {notification.read ? 'Read' : 'Unread'}
                </ReadStatus>
              </NotificationMeta>
            </NotificationContent>
          </NotificationHeader>
        </NotificationCard>
      ))}
    </NotificationsContainer>
  );
}

export default CompanyNotifications;
