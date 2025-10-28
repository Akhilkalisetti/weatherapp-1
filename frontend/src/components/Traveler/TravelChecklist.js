import React, { useState } from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';

const ChecklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 350px;
  overflow-y: auto;
  padding: 10px;
`;

const ChecklistSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #667eea;
`;

const SectionTitle = styled.h5`
  margin: 0 0 10px 0;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  
  &:hover {
    background: #e9ecef;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid ${props => props.checked ? '#667eea' : '#ccc'};
  background: ${props => props.checked ? '#667eea' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
  }
`;

const ItemText = styled.span`
  font-size: 0.9rem;
  color: ${props => props.checked ? '#666' : '#333'};
  text-decoration: ${props => props.checked ? 'line-through' : 'none'};
  flex: 1;
`;

const defaultChecklist = {
  documents: [
    'Valid Passport',
    'Visa (if required)',
    'Travel Insurance',
    'ID Cards',
    'Boarding Passes',
    'Hotel Reservations',
    'Emergency Contacts List'
  ],
  essentials: [
    'Money & Credit Cards',
    'Mobile Phone & Charger',
    'Travel Adapter',
    'First Aid Kit',
    'Sunglasses',
    'Sunblock',
    'Personal Medications',
    'Hand Sanitizer'
  ],
  clothes: [
    'Weather-Appropriate Clothes',
    'Comfortable Walking Shoes',
    'Swimwear (if needed)',
    'Jacket or Sweater',
    'Sleepwear',
    'Undergarments'
  ],
  electronics: [
    'Camera & Charger',
    'Power Bank',
    'Headphones',
    'USB Cables',
    'Laptop/Tablet (optional)',
    'Portable WiFi (optional)'
  ],
  miscellaneous: [
    'Travel Guidebook',
    'Map',
    'Water Bottle',
    'Snacks',
    'Travel Pillow',
    'Earplugs',
    'Lock for Luggage'
  ]
};

function TravelChecklist() {
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('travelChecklist');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleItem = (section, index) => {
    const key = `${section}-${index}`;
    const updated = { ...checklist };
    updated[key] = !updated[key];
    setChecklist(updated);
    localStorage.setItem('travelChecklist', JSON.stringify(updated));
  };

  const renderChecklist = (section, items) => (
    <ChecklistSection key={section}>
      <SectionTitle>{section.charAt(0).toUpperCase() + section.slice(1)}</SectionTitle>
      {items.map((item, index) => {
        const key = `${section}-${index}`;
        const checked = checklist[key] || false;
        return (
          <ChecklistItem key={index} onClick={() => toggleItem(section, index)}>
            <Checkbox checked={checked}>
              {checked && <Check size={16} color="white" />}
            </Checkbox>
            <ItemText checked={checked}>{item}</ItemText>
          </ChecklistItem>
        );
      })}
    </ChecklistSection>
  );

  return (
    <ChecklistContainer>
      {Object.entries(defaultChecklist).map(([section, items]) =>
        renderChecklist(section, items)
      )}
    </ChecklistContainer>
  );
}

export default TravelChecklist;

