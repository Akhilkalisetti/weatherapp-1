import React from 'react';
import styled from 'styled-components';
import { Calendar, MapPin, Trash2, Heart } from 'lucide-react';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
`;

const MemoryCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
`;

const MemoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const MemoryTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
`;

const MemoryDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MemoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
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

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  grid-column: 1 / -1;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

function MemoryGrid({ memories, onDelete }) {
  if (!memories || memories.length === 0) {
    return (
      <EmptyState>
        <Heart size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
        <p>No memories yet. Create your first travel memory!</p>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {memories.map((memory) => (
        <MemoryCard key={memory.id || memory._id}>
          <ImageContainer>
            {memory.images && memory.images.length > 0 ? (
              <MemoryImage 
                src={memory.images[0]} 
                alt={memory.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <ImagePlaceholder style={{ display: memory.images && memory.images.length > 0 ? 'none' : 'flex' }}>
              <Heart size={48} />
            </ImagePlaceholder>
          </ImageContainer>
          
          <CardContent>
            <MemoryTitle>{memory.title}</MemoryTitle>
            <MemoryDescription>{memory.description}</MemoryDescription>
            
            <MemoryMeta>
              <MetaItem>
                <Calendar size={16} />
                {formatDate(memory.date)}
              </MetaItem>
              {memory.location && (
                <MetaItem>
                  <MapPin size={16} />
                  {memory.location}
                </MetaItem>
              )}
            </MemoryMeta>
            
            <CardActions>
              <LikeButton>
                <Heart size={16} />
                Like
              </LikeButton>
              <DeleteButton onClick={() => onDelete(memory.id || memory._id)}>
                <Trash2 size={16} />
                Delete
              </DeleteButton>
            </CardActions>
          </CardContent>
        </MemoryCard>
      ))}
    </GridContainer>
  );
}

export default MemoryGrid;
