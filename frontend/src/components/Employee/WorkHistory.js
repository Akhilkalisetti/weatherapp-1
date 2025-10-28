import React from 'react';
import styled from 'styled-components';
import { Calendar, Clock, Building, Home, Trash2, FileText, CheckCircle, AlertCircle, Pause } from 'lucide-react';

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

const DeleteButton = styled.button`
  background: #ff6b6b;
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
  
  &:hover {
    background: #ee5a24;
    transform: translateY(-1px);
  }
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

function WorkHistory({ reports, onDelete }) {
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
      {reports.map((report) => (
        <ReportCard key={report.id}>
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
            <DeleteButton onClick={() => onDelete(report.id)}>
              <Trash2 size={16} />
              Delete
            </DeleteButton>
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
