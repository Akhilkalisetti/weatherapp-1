import React from 'react';
import styled from 'styled-components';
import { Phone, MapPin, CreditCard, FileText, Clock, AlertCircle } from 'lucide-react';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 350px;
  overflow-y: auto;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 3px solid #667eea;
`;

const SectionTitle = styled.h5`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #666;
`;

const Badge = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const emergencyContacts = {
  general: [
    { label: 'Emergency Services', value: '112 (EU) / 911 (US)' },
    { label: 'Medical Emergency', value: 'Emergency services' },
    { label: 'Police', value: 'Local police services' },
    { label: 'Tourist Helpline', value: 'Check local tourism office' }
  ],
  important: [
    { label: 'Your Embassy', value: 'Find embassy before travel' },
    { label: 'Travel Insurance', value: 'Keep policy number handy' },
    { label: 'Credit Card Lost', value: 'Call bank immediately' },
    { label: 'Passport Lost', value: 'Contact embassy urgently' }
  ],
  documents: [
    'Keep passport copies separate',
    'Store digital copies in cloud',
    'Email yourself important docs',
    'Carry embassy contact details',
    'Keep travel insurance info'
  ],
  safety: [
    'Register with your embassy',
    'Share itinerary with family',
    'Know local emergency numbers',
    'Avoid risky areas at night',
    'Keep valuables secure',
    'Use hotel safe for documents'
  ]
};

function EmergencyInfo() {
  return (
    <InfoContainer>
      <InfoSection>
        <SectionTitle>
          <Phone size={18} color="#667eea" />
          Emergency Contacts
        </SectionTitle>
        <InfoList>
          {emergencyContacts.general.map((item, index) => (
            <InfoItem key={index}>
              <AlertCircle size={16} color="#666" />
              <strong>{item.label}:</strong> {item.value}
            </InfoItem>
          ))}
        </InfoList>
      </InfoSection>

      <InfoSection>
        <SectionTitle>
          <CreditCard size={18} color="#667eea" />
          Important Contacts
        </SectionTitle>
        <InfoList>
          {emergencyContacts.important.map((item, index) => (
            <InfoItem key={index}>
              <FileText size={16} color="#666" />
              <strong>{item.label}:</strong> {item.value}
            </InfoItem>
          ))}
        </InfoList>
      </InfoSection>

      <InfoSection>
        <SectionTitle>
          <FileText size={18} color="#667eea" />
          Document Safety Tips
        </SectionTitle>
        <InfoList>
          {emergencyContacts.documents.map((tip, index) => (
            <InfoItem key={index}>
              <Badge>Tip</Badge>
              {tip}
            </InfoItem>
          ))}
        </InfoList>
      </InfoSection>

      <InfoSection>
        <SectionTitle>
          <AlertCircle size={18} color="#667eea" />
          Safety Reminders
        </SectionTitle>
        <InfoList>
          {emergencyContacts.safety.map((reminder, index) => (
            <InfoItem key={index}>
              <Clock size={16} color="#666" />
              {reminder}
            </InfoItem>
          ))}
        </InfoList>
      </InfoSection>
    </InfoContainer>
  );
}

export default EmergencyInfo;

