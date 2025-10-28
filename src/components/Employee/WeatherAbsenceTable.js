import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Edit, Trash2, CheckCircle, XCircle, Clock, CloudRain } from 'lucide-react';
import { weatherAbsenceAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e1e5e9;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 15px;
  color: #666;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'approved': return '#ecfdf5';
      case 'rejected': return '#fee2e2';
      case 'pending': return '#fef3c7';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'approved': return '#059669';
      case 'rejected': return '#dc2626';
      case 'pending': return '#d97706';
      default: return '#6b7280';
    }
  }};
`;

const ActionCell = styled(TableCell)`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => {
    if (props.variant === 'edit') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (props.variant === 'delete') return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    return '#f8f9fa';
  }};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

const EmptyTitle = styled.h3`
  margin: 20px 0 10px;
  color: #666;
`;

const EmptySubtitle = styled.p`
  color: #999;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 150px;
  background: ${props => {
    if (props.variant === 'primary') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (props.variant === 'success') return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    if (props.variant === 'warning') return 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
    return 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
  }};
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const WeatherInfo = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 5px;
`;

const WeatherBadge = styled.span`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: #e0f2fe;
  color: #0369a1;
`;

function WeatherAbsenceTable() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async (search = '') => {
    setLoading(true);
    try {
      const data = await weatherAbsenceAPI.search(search);
      setRequests(data);
    } catch (error) {
      console.error('Error fetching absence requests:', error);
      toast.error('Failed to load absence requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchRequests(query);
    }, 500);
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this absence request?')) {
      try {
        await weatherAbsenceAPI.delete(requestId);
        toast.success('Request deleted successfully');
        fetchRequests(searchQuery);
      } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('Failed to delete request');
      }
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          <CloudRain size={24} />
          Weather Absence Requests Database Table
        </TableTitle>
      </TableHeader>

      <StatsRow>
        <StatCard variant="primary">
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Requests</StatLabel>
        </StatCard>
        <StatCard variant="warning">
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard variant="success">
          <StatValue>{stats.approved}</StatValue>
          <StatLabel>Approved</StatLabel>
        </StatCard>
        <StatCard variant="danger">
          <StatValue>{stats.rejected}</StatValue>
          <StatLabel>Rejected</StatLabel>
        </StatCard>
      </StatsRow>

      <SearchContainer>
        <SearchIcon size={20} />
        <SearchInput
          type="text"
          placeholder="Search by employee, location, or description..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </SearchContainer>

      {loading ? (
        <EmptyState>
          <div>Loading...</div>
        </EmptyState>
      ) : requests.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No Absence Requests Found</EmptyTitle>
          <EmptySubtitle>Start submitting weather absence requests to see them here.</EmptySubtitle>
        </EmptyState>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Employee</TableHeaderCell>
              <TableHeaderCell>Employee ID</TableHeaderCell>
              <TableHeaderCell>Location</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Weather Data</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Submitted</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell style={{ fontWeight: 600, color: '#667eea' }}>
                  {request.employeeName}
                </TableCell>
                <TableCell>{request.employeeId}</TableCell>
                <TableCell>{request.location}</TableCell>
                <TableCell style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {request.description}
                </TableCell>
                <TableCell style={{ maxWidth: '200px' }}>
                  {request.verificationResult?.weatherData && (
                    <WeatherInfo>
                      <WeatherBadge>🌡️ {request.verificationResult.weatherData.temperature}°C</WeatherBadge>
                      <WeatherBadge>{request.verificationResult.weatherData.condition}</WeatherBadge>
                      {request.verificationResult.isVerified && (
                        <WeatherBadge style={{ background: '#ecfdf5', color: '#059669' }}>
                          ✓ Verified
                        </WeatherBadge>
                      )}
                    </WeatherInfo>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status}>
                    {request.status === 'approved' && <CheckCircle size={14} />}
                    {request.status === 'rejected' && <XCircle size={14} />}
                    {request.status === 'pending' && <Clock size={14} />}
                    {request.status.replace('pending', 'pending')}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {new Date(request.submittedAt).toLocaleDateString()}
                </TableCell>
                <ActionCell>
                  <ActionButton variant="delete" onClick={() => handleDelete(request._id)}>
                    <Trash2 size={16} />
                    Delete
                  </ActionButton>
                </ActionCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </TableContainer>
  );
}

export default WeatherAbsenceTable;

