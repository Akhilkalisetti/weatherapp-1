import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, Building, Home, Trash2, FileText, CheckCircle, AlertCircle, Pause, Edit3, Search } from 'lucide-react';

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ReportMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatusBadge = styled.div`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${props => {
    switch (props.status) {
      case 'completed': return '#d4edda';
      case 'in-progress': return '#cce5ff';
      case 'blocked': return '#f8d7da';
      case 'on-hold': return '#fff3cd';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#155724';
      case 'in-progress': return '#004085';
      case 'blocked': return '#721c24';
      case 'on-hold': return '#856404';
      default: return '#383d41';
    }
  }};
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'edit' ? '#667eea' : '#ff6b6b'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-left: 8px;
  
  &:hover {
    background: ${props => props.variant === 'edit' ? '#5a67d8' : '#ee5a24'};
    transform: translateY(-1px);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ReportContent = styled.div`
  margin-bottom: 15px;
`;

const ProjectTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ReportDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const ReportFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
`;

const HoursWorked = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px 16px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  color: #374151;
`;

const SummaryPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  background: ${props => props.variant === 'completed' ? '#d4edda' : '#cce5ff'};
  color: ${props => props.variant === 'completed' ? '#155724' : '#004085'};
`;

const SearchContainer = styled.div`
  position: relative;
  width: 280px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #fafafa;
  color: #374151;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return <CheckCircle size={16} />;
    case 'in-progress': return <Clock size={16} />;
    case 'blocked': return <AlertCircle size={16} />;
    case 'on-hold': return <Pause size={16} />;
    default: return <FileText size={16} />;
  }
};

const getLocationIcon = (location) => {
  return location === 'home' ? <Home size={16} /> : <Building size={16} />;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

function WorkHistory({ reports, onDelete, onEdit }) {
  console.log('WorkHistory rendered with props:', { 
    reportsCount: reports?.length, 
    hasOnDelete: !!onDelete, 
    hasOnEdit: !!onEdit 
  });

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { filteredReports, completedCount, inProgressCount } = useMemo(() => {
    const safeReports = Array.isArray(reports) ? reports : [];
    const completed = safeReports.filter(r => r.status === 'completed').length;
    const inProgress = safeReports.filter(r => r.status === 'in-progress').length;
    const byStatus = statusFilter === 'all' 
      ? safeReports 
      : safeReports.filter(r => r.status === statusFilter);
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? byStatus.filter(r => (
          (r.project || '').toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (r.status || '').toLowerCase().includes(q)
        ))
      : byStatus;
    return { filteredReports: filtered, completedCount: completed, inProgressCount: inProgress };
  }, [reports, statusFilter, searchQuery]);

  if (!reports || reports.length === 0) {
    return (
      <EmptyState>
        <FileText size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
        <p>No work reports yet. Submit your first work status report!</p>
      </EmptyState>
    );
  }

  return (
    <HistoryContainer>
      <Toolbar>
        <LeftGroup>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="on-hold">On Hold</option>
          </Select>

          <SearchContainer>
            <SearchIcon size={18} />
            <SearchInput
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <ClearButton
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                title="Clear"
              >
                ×
              </ClearButton>
            )}
          </SearchContainer>

          <ActionButton
            variant="edit"
            onClick={() => {
              alert(`Completed: ${completedCount}\nIn Progress: ${inProgressCount}`);
            }}
            title="Show status summary"
          >
            <CheckCircle size={16} />
            Status Summary
          </ActionButton>
        </LeftGroup>
        <RightGroup>
          <SummaryPill variant="completed">
            <CheckCircle size={14} /> {completedCount}
          </SummaryPill>
          <SummaryPill variant="in-progress">
            <Clock size={14} /> {inProgressCount}
          </SummaryPill>
        </RightGroup>
      </Toolbar>
      {filteredReports.length === 0 ? (
        <EmptyState>
          <FileText size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <p>No reports match the current filters.</p>
        </EmptyState>
      ) : filteredReports.map((report) => (
        <ReportCard key={report._id || report.id}>
          <ReportHeader>
            <ReportMeta>
              <MetaItem>
                <Calendar size={16} />
                {formatDate(report.date)}
              </MetaItem>
              <MetaItem>
                {getLocationIcon(report.workLocation)}
                {report.workLocation === 'home' ? 'WFH' : 'Office'}
              </MetaItem>
              <MetaItem>
                <Clock size={16} />
                {formatTime(report.createdAt)}
              </MetaItem>
            </ReportMeta>
            <ActionButtons>
              <ActionButton 
                variant="edit" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Edit button clicked!');
                  console.log('Edit clicked for report:', report);
                  console.log('onEdit function:', onEdit);
                  console.log('onEdit type:', typeof onEdit);
                  
                  if (onEdit && typeof onEdit === 'function') {
                    console.log('Calling onEdit function...');
                    onEdit(report);
                  } else {
                    console.error('onEdit function is not provided or not a function!');
                    alert('Edit functionality not available. onEdit is: ' + typeof onEdit);
                  }
                }}
                style={{ 
                  pointerEvents: 'auto',
                  zIndex: 10,
                  position: 'relative'
                }}
              >
                <Edit3 size={16} />
                Edit
              </ActionButton>
              <ActionButton variant="delete" onClick={() => {
                console.log('Delete clicked for report:', report);
                console.log('Report ID:', report._id || report.id);
                onDelete(report._id || report.id);
              }}>
                <Trash2 size={16} />
                Delete
              </ActionButton>
            </ActionButtons>
          </ReportHeader>
          
          <ReportContent>
            <ProjectTitle>{report.project}</ProjectTitle>
            <ReportDescription>{report.description}</ReportDescription>
          </ReportContent>
          
          <ReportFooter>
            <StatusBadge status={report.status}>
              {getStatusIcon(report.status)}
              {report.status.replace('-', ' ').toUpperCase()}
            </StatusBadge>
            {report.hours && (
              <HoursWorked>
                <Clock size={16} />
                {report.hours} hours
              </HoursWorked>
            )}
          </ReportFooter>
        </ReportCard>
      ))}
    </HistoryContainer>
  );
}

export default WorkHistory;
