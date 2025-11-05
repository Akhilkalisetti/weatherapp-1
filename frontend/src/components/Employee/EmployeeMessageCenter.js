import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Search, User, Filter, Zap, AlertCircle, CheckCircle, Clock, CloudRain, TrendingUp, MessageSquare, Info, Star } from 'lucide-react';
import { messageAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MessageCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : props.variant === 'success'
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    : '#f8f9fa'};
  color: ${props => props.variant === 'primary' || props.variant === 'success' ? 'white' : '#333'};
  border: ${props => props.variant === 'primary' || props.variant === 'success' ? 'none' : '2px solid #e1e5e9'};
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const CategoryButton = styled.button`
  padding: 12px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  background: ${props => props.selected ? '#f0f4ff' : 'white'};
  color: ${props => props.selected ? '#667eea' : '#666'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

const getCategoryIcon = (category) => {
  switch (category) {
    case 'performance': return <TrendingUp size={18} />;
    case 'attendance': return <Clock size={18} />;
    case 'meeting': return <MessageSquare size={18} />;
    case 'weather': return <CloudRain size={18} />;
    case 'suggestion': return <Info size={18} />;
    default: return <MessageSquare size={18} />;
  }
};

const categoryLabels = {
  performance: 'Performance Report',
  attendance: 'Attendance Alert',
  meeting: 'Meeting Reminder',
  weather: 'Weather Alert',
  suggestion: 'Suggestion',
  info: 'General Info'
};

function EmployeeMessageCenter() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [important, setImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAlerts, setIsGeneratingAlerts] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (employeeSearch.length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const results = await messageAPI.searchEmployees(employeeSearch);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [employeeSearch]);

  // Try to resolve a typed value (ID/email/name) into an employee if user didn't click a result
  const resolveEmployeeFromInput = async () => {
    const query = (employeeSearch || '').trim();
    if (!query) return null;

    try {
      const results = await messageAPI.searchEmployees(query);
      if (!Array.isArray(results) || results.length === 0) return null;

      // 1) Exact _id match
      const byId = results.find(e => e._id === query);
      if (byId) return byId;

      // 2) Exact email match (case-insensitive)
      const lower = query.toLowerCase();
      const byEmail = results.find(e => (e.email || '').toLowerCase() === lower);
      if (byEmail) return byEmail;

      // 3) Exact name match (case-insensitive)
      const byName = results.find(e => (e.name || '').toLowerCase() === lower);
      if (byName) return byName;

      // 4) If single result, assume it's the intended employee
      if (results.length === 1) return results[0];

      return null;
    } catch (err) {
      console.error('Resolve employee error:', err);
      return null;
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeSearch(employee.name);
    setSearchResults([]);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault(); // Prevent any form submission
    
    console.log('📤 Send message button clicked');
    console.log('📋 Form data:', { selectedEmployee, category, title, message, important });

    let employee = selectedEmployee;
    if (!employee) {
      employee = await resolveEmployeeFromInput();
      if (employee) {
        setSelectedEmployee(employee);
      }
    }

    const hasCategory = !!(category && String(category).trim());
    const hasTitle = !!(title && title.trim());
    const hasMessage = !!(message && message.trim());

    if (!employee || !hasCategory || !hasTitle || !hasMessage) {
      console.warn('❌ Missing required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📨 Sending message to API...');
      const response = await messageAPI.create({
        employeeId: employee._id,
        category,
        title: title.trim(),
        message: message.trim(),
        messageText: message.trim(),
        important
      });
      console.log('✅ Message sent successfully:', response);
      toast.success('Message sent successfully!');
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 2000);
      setTitle('');
      setMessage('');
      setSelectedEmployee(null);
      setEmployeeSearch('');
      setImportant(false);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Error details:', error.message || error);
      const errorMessage = error.message || 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAlerts = async () => {
    setIsGeneratingAlerts(true);
    try {
      const result = await messageAPI.generateAlerts();
      toast.success(`Generated ${result.alerts.length} automated alerts!`);
    } catch (error) {
      toast.error(error.message || 'Failed to generate alerts');
    } finally {
      setIsGeneratingAlerts(false);
    }
  };

  return (
    <MessageCenterContainer>
      <Card>
        <CardTitle>
          <Send size={24} />
          Send Message to Employee
        </CardTitle>
        
        <FormGroup>
          <Label>Employee</Label>
          <SearchContainer>
            <Input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <SearchResults>
                {searchResults.map((emp) => (
                  <SearchResultItem
                    key={emp._id}
                    onClick={() => handleEmployeeSelect(emp)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {emp.avatar && (
                        <img src={emp.avatar} alt={emp.name} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{emp.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{emp.email}</div>
                      </div>
                    </div>
                  </SearchResultItem>
                ))}
              </SearchResults>
            )}
          </SearchContainer>
          {selectedEmployee && (
            <div style={{ marginTop: '10px', padding: '10px', background: '#f0f4ff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} />
              <span style={{ fontWeight: 500 }}>Selected: {selectedEmployee.name}</span>
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Category</Label>
          <CategoryGrid>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <CategoryButton
                key={key}
                selected={category === key}
                onClick={() => setCategory(key)}
              >
                {getCategoryIcon(key)}
                {label}
              </CategoryButton>
            ))}
          </CategoryGrid>
        </FormGroup>

        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Enter message title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Message</Label>
          <TextArea
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
            />
            <Star size={16} />
            Mark as Important
          </CheckboxContainer>
        </FormGroup>

        <Button
          type="button"
          variant="primary"
          onClick={handleSendMessage}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Send size={20} />
              Sending...
            </>
          ) : sentSuccess ? (
            <>
              <CheckCircle size={20} />
              Sent
            </>
          ) : (
            <>
              <Send size={20} />
              Send
            </>
          )}
        </Button>
      </Card>

      <Card>
        <CardTitle>
          <Zap size={24} />
          Automated Alerts
        </CardTitle>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Generate automated alerts for attendance, weather, and other conditions based on employee data.
        </p>
        <Button
          variant="success"
          onClick={handleGenerateAlerts}
          disabled={isGeneratingAlerts}
        >
          <Zap size={20} />
          {isGeneratingAlerts ? 'Generating...' : 'Generate Automated Alerts'}
        </Button>
      </Card>
    </MessageCenterContainer>
  );
}

export default EmployeeMessageCenter;
