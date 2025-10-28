import React, { useState } from 'react';
import styled from 'styled-components';
import { Camera, Upload, X } from 'lucide-react';
import { memoryAPI } from '../../services/api';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  
  &:hover {
    border-color: #667eea;
    background: #f0f2ff;
  }
  
  ${props => props.hasFiles && `
    border-color: #667eea;
    background: #f0f2ff;
  `}
`;

const FileInput = styled.input`
  display: none;
`;

const UploadText = styled.div`
  color: #666;
  margin-bottom: 10px;
`;

const UploadIcon = styled(Upload)`
  color: #667eea;
  margin-bottom: 10px;
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 15px;
`;

const PreviewImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ff6b6b;
  
  &:hover {
    background: white;
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

function MemoryForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Convert images to base64 for storage (in a real app, you'd upload to a server)
      const imageData = await Promise.all(
        images.map(async (img) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(img.file);
          });
        })
      );

      const memoryData = {
        ...formData,
        images: imageData
      };

      // Send to backend API
      const response = await memoryAPI.create(memoryData);
      console.log('✅ Memory created:', response.memory?.title);
      
      // Call onSubmit callback to refresh the list
      if (onSubmit && response.memory) {
        onSubmit(response.memory);
      }
      
      // Reset form
      setFormData({
        title: '',
        date: '',
        description: '',
        location: ''
      });
      setImages([]);
    } catch (error) {
      console.error('❌ Error creating memory:', error.message);
      alert(`Failed to create memory: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Memory Title *</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Amazing sunset in Paris"
            required
          />
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
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Eiffel Tower, Paris"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Share your travel story and memories..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Photos</Label>
          <FileUploadArea hasFiles={images.length > 0}>
            <FileInput
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="images" style={{ cursor: 'pointer' }}>
              <UploadIcon size={32} />
              <UploadText>
                Click to upload photos or drag and drop
              </UploadText>
              <div style={{ fontSize: '0.9rem', color: '#999' }}>
                PNG, JPG up to 10MB each
              </div>
            </label>
          </FileUploadArea>
          
          {images.length > 0 && (
            <ImagePreview>
              {images.map((img, index) => (
                <PreviewImage key={index}>
                  <Image src={img.preview} alt={`Preview ${index + 1}`} />
                  <RemoveButton onClick={() => removeImage(index)}>
                    <X size={16} />
                  </RemoveButton>
                </PreviewImage>
              ))}
            </ImagePreview>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          <Camera size={20} />
          {loading ? 'Creating Memory...' : 'Create Memory'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default MemoryForm;
