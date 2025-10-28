import React, { useState } from 'react';
import styled from 'styled-components';
import { Bookmark, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GalleryContainer = styled.div`
  width: 100%;
  position: relative;
`;

const GalleryViewport = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  padding: 40px 20px;
`;

const GalleryTrack = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.5s ease;
  transform: translateX(${props => -props.translateX}px);
  padding: 0 10px;
`;

const ImageCard = styled.div`
  min-width: 300px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05) translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  height: 350px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${ImageCard}:hover & {
    transform: scale(1.1);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 40px 20px 20px;
  transform: translateY(100%);
  transition: transform 0.5s ease;
  
  ${ImageCard}:hover & {
    transform: translateY(0);
  }
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  padding: 20px;
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  background: white;
`;

const OverlayTitle = styled.h3`
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const OverlayDetails = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const DetailIcon = styled.span`
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaginationDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

const NavigationArrows = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
`;

const ArrowButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40px;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.5rem;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.8;
`;

function Gallery({ memories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bookmarkedImages, setBookmarkedImages] = useState(() => {
    const saved = localStorage.getItem('bookmarkedImages');
    return saved ? JSON.parse(saved) : [];
  });

  // Extract all images from memories
  const allImages = [];
  memories.forEach(memory => {
    if (memory.images && memory.images.length > 0) {
      memory.images.forEach(image => {
        allImages.push({
          id: `${memory.id}-${image}`,
          src: image,
          title: memory.title,
          location: memory.location,
          date: memory.date
        });
      });
    }
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(allImages.length / itemsPerPage);

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const toggleBookmark = (imageId, e) => {
    e.stopPropagation();
    const isBookmarked = bookmarkedImages.includes(imageId);
    const updated = isBookmarked
      ? bookmarkedImages.filter(id => id !== imageId)
      : [...bookmarkedImages, imageId];
    
    setBookmarkedImages(updated);
    localStorage.setItem('bookmarkedImages', JSON.stringify(updated));
    
    if (isBookmarked) {
      toast.success('Removed from bookmarks');
    } else {
      toast.success('Added to bookmarks');
    }
  };

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  if (allImages.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📸</EmptyIcon>
        <EmptyTitle>No Images Yet</EmptyTitle>
        <EmptyDescription>Upload some travel memories to see them here!</EmptyDescription>
      </EmptyState>
    );
  }

  const currentImages = allImages.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const translateX = currentIndex * itemsPerPage * 320; // 300px card + 20px gap

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <GalleryContainer>
      <GalleryViewport>
        <GalleryTrack translateX={translateX}>
          {currentImages.map((image, index) => (
            <ImageCard key={image.id} onClick={() => openImage(image)}>
              <CardImageContainer>
                <BookmarkButton
                  onClick={(e) => toggleBookmark(image.id, e)}
                  title={bookmarkedImages.includes(image.id) ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Bookmark 
                    size={20} 
                    fill={bookmarkedImages.includes(image.id) ? '#667eea' : 'none'}
                    color={bookmarkedImages.includes(image.id) ? '#667eea' : '#666'}
                  />
                </BookmarkButton>
                <CardImage src={image.src} alt={image.title} />
                <ImageOverlay>
                  <OverlayTitle>{image.title}</OverlayTitle>
                  <OverlayDetails>
                    {image.location && (
                      <DetailItem>
                        <DetailIcon>📍</DetailIcon>
                        {image.location}
                      </DetailItem>
                    )}
                    <DetailItem>
                      <DetailIcon>📅</DetailIcon>
                      {formatDate(image.date)}
                    </DetailItem>
                    <DetailItem>
                      <DetailIcon>🖼️</DetailIcon>
                      Travel Memory
                    </DetailItem>
                  </OverlayDetails>
                </ImageOverlay>
              </CardImageContainer>
              <CardTitle>{image.title}</CardTitle>
            </ImageCard>
          ))}
        </GalleryTrack>

        <PaginationDots>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Dot
              key={index}
              active={index === currentIndex}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </PaginationDots>

        <NavigationArrows>
          <ArrowButton onClick={handlePrev} disabled={currentIndex === 0}>
            <ChevronLeft size={24} />
          </ArrowButton>
          <ArrowButton onClick={handleNext} disabled={currentIndex === totalPages - 1}>
            <ChevronRight size={24} />
          </ArrowButton>
        </NavigationArrows>
      </GalleryViewport>

      {selectedImage && (
        <ModalOverlay onClick={closeImage}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeImage}>
              <X size={24} />
            </CloseButton>
            <ModalImage src={selectedImage.src} alt={selectedImage.title} />
          </ModalContent>
        </ModalOverlay>
      )}
    </GalleryContainer>
  );
}

export default Gallery;

