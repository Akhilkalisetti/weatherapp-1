import React, { useState } from 'react';
import styled from 'styled-components';
import { Briefcase, Home, Building, Send, FileText } from 'lucide-react';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WorkLocationSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const LocationButton = styled.button`
  flex: 1;
  padding: 15px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  background: ${props => props.selected ? '#f0f2ff' : 'white'};
  color: ${props => props.selected ? '#667eea' : '#666'};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f0f2ff;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const QuickActionButton = styled.button`
  padding: 10px;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

function WorkStatusForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    workLocation: 'office',
    project: '',
    status: 'in-progress',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({
      ...prev,
      workLocation: location
    }));
  };

  const handleQuickAction = (action) => {
    const quickActions = {
      'completed': {
        status: 'completed',
        description: 'Completed all assigned tasks for today.'
      },
      'blocked': {
        status: 'blocked',
        description: 'Currently blocked on a task, waiting for dependencies.'
      },
      'meeting': {
        status: 'in-progress',
        description: 'Attended team meetings and collaborative sessions.'
      },
      'research': {
        status: 'in-progress',
        description: 'Conducted research and analysis for upcoming projects.'
      }
    };

    if (quickActions[action]) {
      setFormData(prev => ({
        ...prev,
        ...quickActions[action]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

      onSubmit(reportData);
      
      // Reset form
      setFormData({
        workLocation: 'office',
        project: '',
        status: 'in-progress',
        description: '',
        hours: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Work Location *</Label>
          <WorkLocationSelector>
            <LocationButton
              type="button"
              selected={formData.workLocation === 'office'}
              onClick={() => handleLocationChange('office')}
            >
              <Building size={24} />
              Office
            </LocationButton>
            <LocationButton
              type="button"
              selected={formData.workLocation === 'home'}
              onClick={() => handleLocationChange('home')}
            >
              <Home size={24} />
              Home
            </LocationButton>
          </WorkLocationSelector>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Date *</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="project">Project/Task *</Label>
          <Input
            type="text"
            id="project"
            name="project"
            value={formData.project}
            onChange={handleInputChange}
            placeholder="e.g., Website Redesign, Bug Fixes"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="on-hold">On Hold</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="hours">Hours Worked</Label>
          <Input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleInputChange}
            placeholder="8"
            min="0"
            max="24"
            step="0.5"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Work Description *</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what you worked on today, any challenges faced, or updates on your projects..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Quick Actions</Label>
          <QuickActions>
            <QuickActionButton type="button" onClick={() => handleQuickAction('completed')}>
              Mark as Completed
            </QuickActionButton>
            <QuickActionButton type="button" onClick={() => handleQuickAction('blocked')}>
              Report Blocked
            </QuickActionButton>
            <QuickActionButton type="button" onClick={() => handleQuickAction('meeting')}>
              Meeting Day
            </QuickActionButton>
            <QuickActionButton type="button" onClick={() => handleQuickAction('research')}>
              Research Day
            </QuickActionButton>
          </QuickActions>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          <Send size={20} />
          {loading ? 'Submitting...' : 'Submit Report'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default WorkStatusForm;
