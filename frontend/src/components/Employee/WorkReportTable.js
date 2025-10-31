import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Search, Edit, Trash2, Download, Briefcase, Clock, MapPin } from 'lucide-react';
import { workReportAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

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
  width: 360px;
  max-width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 45px;
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

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
  }
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
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'completed': return '#ecfdf5';
      case 'in-progress': return '#dbeafe';
      case 'pending': return '#fef3c7';
      case 'blocked': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#059669';
      case 'in-progress': return '#0284c7';
      case 'pending': return '#d97706';
      case 'blocked': return '#dc2626';
      default: return '#6b7280';
    }
  }};
`;

const LocationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.location === 'home' ? '#ecfdf5' : '#dbeafe'};
  color: ${props => props.location === 'home' ? '#059669' : '#0284c7'};
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
    return 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
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

function WorkReportTable() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskQuery, setTaskQuery] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (search = '') => {
    setLoading(true);
    try {
      const data = await workReportAPI.search(search);
      setReports(data);
    } catch (error) {
      console.error('Error fetching work reports:', error);
      toast.error('Failed to load work reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchReports(query);
    }, 500);
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this work report?')) {
      try {
        await workReportAPI.delete(reportId);
        toast.success('Work report deleted successfully');
        fetchReports(searchQuery);
      } catch (error) {
        console.error('Error deleting report:', error);
        toast.error('Failed to delete work report');
      }
    }
  };

  const handleEdit = (report) => {
    toast.success(`Edit functionality for "${report.project}" coming soon!`);
  };

  const stats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    thisWeek: reports.filter(r => {
      const reportDate = new Date(r.date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return reportDate > weekAgo;
    }).length
  };

  const filteredReports = useMemo(() => {
    if (!taskQuery) return reports;
    const q = taskQuery.toLowerCase();
    return reports.filter(r => (r.tasks || '').toLowerCase().includes(q));
  }, [reports, taskQuery]);

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          <Briefcase size={24} />
          Work Reports Database Table
        </TableTitle>
        <SearchContainer>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search by project, tasks, location, or status..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <ClearButton
              aria-label="Clear search"
              onClick={() => {
                setSearchQuery('');
                fetchReports('');
              }}
              title="Clear"
            >
              ×
            </ClearButton>
          )}
        </SearchContainer>
      </TableHeader>

      <StatsRow>
        <StatCard variant="primary">
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Reports</StatLabel>
        </StatCard>
        <StatCard variant="success">
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatCard>
        <StatCard variant="warning">
          <StatValue>{stats.inProgress}</StatValue>
          <StatLabel>In Progress</StatLabel>
        </StatCard>
        <StatCard variant="primary">
          <StatValue>{stats.thisWeek}</StatValue>
          <StatLabel>This Week</StatLabel>
        </StatCard>
      </StatsRow>

      <SearchContainer>
        <SearchIcon size={20} />
        <SearchInput
          type="text"
          placeholder="Search tasks only..."
          value={taskQuery}
          onChange={(e) => setTaskQuery(e.target.value)}
        />
        {taskQuery && (
          <ClearButton
            aria-label="Clear task search"
            onClick={() => setTaskQuery('')}
            title="Clear"
          >
            ×
          </ClearButton>
        )}
      </SearchContainer>


      {loading ? (
        <EmptyState>
          <div>Loading...</div>
        </EmptyState>
      ) : filteredReports.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No Work Reports Found</EmptyTitle>
          <EmptySubtitle>Start submitting work reports to see them here.</EmptySubtitle>
        </EmptyState>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Project</TableHeaderCell>
              <TableHeaderCell>Tasks</TableHeaderCell>
              <TableHeaderCell>Location</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {filteredReports.map((report) => (
              <TableRow key={report._id}>
                <TableCell style={{ fontWeight: 600, color: '#333' }}>
                  {report.date}
                </TableCell>
                <TableCell style={{ fontWeight: 600, color: '#667eea' }}>
                  {report.project}
                </TableCell>
                <TableCell style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {report.tasks}
                </TableCell>
                <TableCell>
                  <LocationBadge location={report.location}>
                    {report.location === 'home' ? '🏠 Home' : '🏢 Office'}
                  </LocationBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={report.status}>
                    {report.status.replace('-', ' ')}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
                <ActionCell>
                  <ActionButton variant="edit" onClick={() => handleEdit(report)}>
                    <Edit size={16} />
                    Edit
                  </ActionButton>
                  <ActionButton variant="delete" onClick={() => handleDelete(report._id)}>
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

export default WorkReportTable;

