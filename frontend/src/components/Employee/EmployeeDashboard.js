import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { workReportAPI, weatherAbsenceAPI } from '../../services/api';
import { LogOut, Briefcase, Home, Building, Bell, FileText, Clock, CloudRain, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkStatusForm from './WorkStatusForm';
import WorkHistory from './WorkHistory';
import CompanyNotifications from './CompanyNotifications';
import WeatherAbsenceForm from './WeatherAbsenceForm';
import AbsenceRequests from './AbsenceRequests';

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
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
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

const StatusCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  margin-bottom: 20px;
`;

const StatusTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatusValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatusSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
`;

function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('status');
  const [workReports, setWorkReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [weatherAbsenceRequests, setWeatherAbsenceRequests] = useState([]);
  const [editingReport, setEditingReport] = useState(null);

  useEffect(() => {
    // Load work reports from backend API
    const loadWorkReports = async () => {
      try {
        const reports = await workReportAPI.getAll();
        setWorkReports(reports);
        console.log('✅ Loaded', reports.length, 'work reports from backend');
      } catch (error) {
        console.error('❌ Error loading work reports:', error.message);
        setWorkReports([]);
      }
    };

    // Load weather absence requests from backend API
    const loadWeatherAbsenceRequests = async () => {
      try {
        const requests = await weatherAbsenceAPI.getMine();
        setWeatherAbsenceRequests(requests);
        console.log('✅ Loaded', requests.length, 'weather absence requests from backend');
      } catch (error) {
        console.error('❌ Error loading weather absence requests:', error.message);
        setWeatherAbsenceRequests([]);
      }
    };

    loadWorkReports();
    loadWeatherAbsenceRequests();

    // Load company notifications (local for now)
    const savedNotifications = localStorage.getItem('companyNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      // Initialize with some default notifications
      const defaultNotifications = [
        {
          id: 1,
          title: 'New WFH Policy Update',
          message: 'Starting next week, employees can work from home up to 3 days per week.',
          type: 'info',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          title: 'Team Meeting Reminder',
          message: 'Don\'t forget about the weekly team meeting tomorrow at 10 AM.',
          type: 'reminder',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: false
        }
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('companyNotifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const addWorkReport = async (report, isEditing = false) => {
    console.log('📝 addWorkReport called with:', { report, isEditing });
    
    try {
      if (isEditing) {
        // Update existing report
        const reportData = {
          date: report.date || new Date().toISOString().split('T')[0],
          project: report.project || 'General',
          tasks: report.description || '',
          location: report.workLocation || 'office',
          status: report.status || 'in-progress',
          hours: report.hours || ''
        };
        
        const reportId = report._id || report.id;
        console.log('🔄 Updating report with ID:', reportId);
        console.log('🔄 Update data:', reportData);
        
        try {
          const updateResult = await workReportAPI.update(reportId, reportData);
          console.log('✅ Work report update result:', updateResult);
        } catch (updateError) {
          console.error('❌ Update API call failed:', updateError);
          throw updateError;
        }
      } else {
        // Create new report
        const reportData = {
          date: report.date || new Date().toISOString().split('T')[0],
          project: report.project || 'General',
          tasks: report.description || '',
          location: report.workLocation || 'office',
          status: report.status || 'in-progress',
          hours: report.hours || ''
        };
        
        console.log('➕ Creating new report with data:', reportData);
        const createResult = await workReportAPI.create(reportData);
        console.log('✅ Work report create result:', createResult);
      }
      
      // Reload from backend
      console.log('🔄 Reloading reports from backend...');
      const reports = await workReportAPI.getAll();
      console.log('📊 Loaded reports:', reports);
      setWorkReports(reports);
      setEditingReport(null);
      console.log('✅ Total reports after update:', reports.length);
    } catch (error) {
      console.error('❌ Error saving work report:', error);
      console.error('❌ Error details:', error.message);
      alert(`Failed to save work report: ${error.message}`);
    }
  };

  const deleteWorkReport = async (reportId) => {
    console.log('🗑️ Attempting to delete report with ID:', reportId);
    try {
      await workReportAPI.delete(reportId);
      console.log('✅ Delete API call successful');
      
      // Reload from backend
      const reports = await workReportAPI.getAll();
      setWorkReports(reports);
      console.log('✅ Work report deleted. Total:', reports.length);
    } catch (error) {
      console.error('❌ Error deleting work report:', error.message);
      alert(`Failed to delete work report: ${error.message}`);
    }
  };

  const handleEditReport = (report) => {
    console.log('🖊️ Edit report called with:', report);
    console.log('Report ID for editing:', report._id || report.id);
    console.log('Setting editing report to:', report);
    setEditingReport(report);
    setActiveTab('status'); // Switch to status tab to show the form
    console.log('Switched to status tab for editing');
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  // Test function to verify backend connection
  const testBackendConnection = async () => {
    try {
      console.log('🧪 Testing backend connection...');
      const reports = await workReportAPI.getAll();
      console.log('✅ Backend is accessible, loaded', reports.length, 'reports');
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('companyNotifications', JSON.stringify(updatedNotifications));
  };

  const addWeatherAbsenceRequest = async (request) => {
    try {
      // Call backend API to create absence request
      const absenceData = {
        employeeName: request.employeeName || user?.name || '',
        employeeId: request.employeeId || user?.id || '',
        location: request.location,
        description: request.description,
        verificationResult: request.verificationResult
      };
      
      await weatherAbsenceAPI.create(absenceData);
      
      // Reload from backend
      const requests = await weatherAbsenceAPI.getMine();
      setWeatherAbsenceRequests(requests);
      console.log('✅ Weather absence request added. Total:', requests.length);
    } catch (error) {
      console.error('❌ Error adding weather absence request:', error.message);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const todayReports = workReports.filter(r => {
    const reportDate = new Date(r.createdAt || r.date);
    const today = new Date();
    return reportDate.toDateString() === today.toDateString();
  }).length;
  const pendingWeatherRequests = weatherAbsenceRequests.filter(r => r.status === 'pending').length;

  return (
    <DashboardContainer>
      <Header>
        <UserInfo>
          <Avatar src={user.avatar} alt={user.name} />
          <UserDetails>
            <h2>Welcome, {user.name}!</h2>
            <p>Ready to report your work status?</p>
          </UserDetails>
        </UserInfo>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/wellness')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Heart size={20} />
            Wellness Dashboard
          </button>
          <button
            onClick={testBackendConnection}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            Test Backend
          </button>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </LogoutButton>
        </div>
      </Header>

      <TabContainer>
        <TabHeader>
          <Tab 
            active={activeTab === 'status'} 
            onClick={() => setActiveTab('status')}
          >
            <Briefcase size={20} />
            Work Status
          </Tab>
          <Tab 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            <Clock size={20} />
            History
          </Tab>
          <Tab 
            active={activeTab === 'weather'} 
            onClick={() => setActiveTab('weather')}
          >
            <CloudRain size={20} />
            Weather Absence
            {pendingWeatherRequests > 0 && (
              <span style={{
                background: '#ff6b6b',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '5px'
              }}>
                {pendingWeatherRequests}
              </span>
            )}
          </Tab>
          <Tab 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={20} />
            Notifications
            {unreadNotifications > 0 && (
              <span style={{
                background: '#ff6b6b',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '5px'
              }}>
                {unreadNotifications}
              </span>
            )}
          </Tab>
        </TabHeader>

        <TabContent>
          {activeTab === 'status' && (
            <ContentGrid>
              <Card>
                <CardTitle>
                  <FileText size={24} />
                  Report Work Status
                </CardTitle>
                <WorkStatusForm 
                  onSubmit={addWorkReport} 
                  editData={editingReport}
                  onCancelEdit={handleCancelEdit}
                />
              </Card>
              
              <div>
                <StatusCard>
                  <StatusTitle>Today's Reports</StatusTitle>
                  <StatusValue>{todayReports}</StatusValue>
                  <StatusSubtitle>Work status reports submitted today</StatusSubtitle>
                </StatusCard>
                
                <StatusCard>
                  <StatusTitle>Total Reports</StatusTitle>
                  <StatusValue>{workReports.length}</StatusValue>
                  <StatusSubtitle>All-time work status reports</StatusSubtitle>
                </StatusCard>
              </div>
            </ContentGrid>
          )}

          {activeTab === 'history' && (
            <Card>
              <CardTitle>
                <Clock size={24} />
                Work History
              </CardTitle>
              <WorkHistory 
                reports={workReports}
                onDelete={deleteWorkReport}
                onEdit={handleEditReport}
              />
            </Card>
          )}

          {activeTab === 'weather' && (
            <ContentGrid>
              <Card>
                <CardTitle>
                  <CloudRain size={24} />
                  Report Weather Absence
                </CardTitle>
                <WeatherAbsenceForm onSubmit={addWeatherAbsenceRequest} />
              </Card>
              
              <div>
                <StatusCard>
                  <StatusTitle>Pending Requests</StatusTitle>
                  <StatusValue>{pendingWeatherRequests}</StatusValue>
                  <StatusSubtitle>Weather absence requests awaiting approval</StatusSubtitle>
                </StatusCard>
                
                <StatusCard>
                  <StatusTitle>Total Requests</StatusTitle>
                  <StatusValue>{weatherAbsenceRequests.length}</StatusValue>
                  <StatusSubtitle>All-time weather absence reports</StatusSubtitle>
                </StatusCard>
              </div>
            </ContentGrid>
          )}

          {activeTab === 'weather' && (
            <Card>
              <CardTitle>
                <CloudRain size={24} />
                Weather Absence Requests
              </CardTitle>
              <AbsenceRequests 
                requests={weatherAbsenceRequests}
              />
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardTitle>
                <Bell size={24} />
                Company Notifications
              </CardTitle>
              <CompanyNotifications 
                notifications={notifications}
                onMarkAsRead={markNotificationAsRead}
              />
            </Card>
          )}
        </TabContent>
      </TabContainer>
    </DashboardContainer>
  );
}

export default EmployeeDashboard;
