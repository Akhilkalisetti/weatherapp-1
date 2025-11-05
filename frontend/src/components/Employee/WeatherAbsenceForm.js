import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { getWeatherData, getWeatherByCoords, getWeatherIcon, getWeatherDescription } from '../../services/weatherService';
import { CloudRain, MapPin, FileText, Camera, Send, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const FormTitle = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.4rem;
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
  
  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const FileInputContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  border: 2px dashed #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  
  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 20px;
  
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

const VerificationResult = styled.div`
  margin-top: 25px;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid ${props => {
    if (props.type === 'verified') return '#10b981';
    if (props.type === 'warning') return '#f59e0b';
    return '#6b7280';
  }};
  background: ${props => {
    if (props.type === 'verified') return '#ecfdf5';
    if (props.type === 'warning') return '#fffbeb';
    return '#f9fafb';
  }};
`;

const VerificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-weight: 600;
  color: ${props => {
    if (props.type === 'verified') return '#059669';
    if (props.type === 'warning') return '#d97706';
    return '#374151';
  }};
`;

const WeatherInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const WeatherItem = styled.div`
  text-align: center;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const WeatherIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 5px;
`;

const WeatherLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 2px;
`;

const WeatherValue = styled.div`
  font-weight: 600;
  color: #374151;
`;

const ImagePreview = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function WeatherAbsenceForm({ onSubmit }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    employeeName: user?.name || '',
    employeeId: user?.id || '',
    location: '',
    description: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fetchedWeather, setFetchedWeather] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const debounceTimer = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Debounced live weather fetch when typing location
  useEffect(() => {
    const value = formData.location?.trim();
    setWeatherError('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!value) {
      setFetchedWeather(null);
      return;
    }
    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await getWeatherData(value);
        setFetchedWeather(data);
      } catch (err) {
        setFetchedWeather(null);
        setWeatherError(typeof err?.message === 'string' ? err.message : 'Unable to fetch weather');
      }
    }, 1000);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [formData.location]);

  const useMyLocation = async () => {
    try {
      if (!navigator.geolocation) {
        setWeatherError('Geolocation is not supported by your browser');
        return;
      }
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const data = await getWeatherByCoords(latitude, longitude);
          setFetchedWeather(data);
          setFormData(prev => ({ ...prev, location: data.city || `${latitude.toFixed(3)}, ${longitude.toFixed(3)}` }));
          setWeatherError('');
        } catch (err) {
          setWeatherError(typeof err?.message === 'string' ? err.message : 'Unable to fetch weather for your location');
        }
      }, (geoErr) => {
        setWeatherError(geoErr?.message || 'Failed to get your location');
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
    } catch (e) {
      setWeatherError('Failed to access geolocation');
    }
  };

  const isSevereWeather = (weatherData) => {
    const severeConditions = ['stormy', 'rainy'];
    const severeAlerts = weatherData.alerts?.filter(alert => 
      alert.type === 'warning' || alert.type === 'alert'
    );
    
    return severeConditions.includes(weatherData.condition) || 
           severeAlerts?.length > 0 ||
           weatherData.windSpeed > 20 ||
           weatherData.temperature < 0 ||
           weatherData.temperature > 35;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location.trim()) {
      toast.error('Please enter your location');
      return;
    }

    setIsSubmitting(true);
    setVerificationResult(null);

    try {
      // Prefer already-fetched weather to avoid extra API calls
      let weatherData = fetchedWeather;
      if (!weatherData) {
        try {
          weatherData = await getWeatherData(formData.location);
        } catch (e) {
          // Allow manual override if fetch fails
          weatherData = {
            temperature: undefined,
            condition: 'unknown',
            humidity: undefined,
            windSpeed: undefined,
            alerts: []
          };
        }
      }
      
      const isSevere = isSevereWeather(weatherData);
      
      const result = {
        isVerified: isSevere,
        weatherData,
        location: formData.location,
        timestamp: new Date().toISOString()
      };

      setVerificationResult(result);

      // Create the absence request
      const absenceRequest = {
        ...formData,
        id: Date.now(),
        status: isSevere ? 'pending' : 'pending',
        verificationResult: result,
        submittedAt: new Date().toISOString(),
        imagePreview: imagePreview
      };

      // Submit the request
      onSubmit(absenceRequest);
      
      if (isSevere) {
        toast.success('Weather condition verified! Request submitted for approval.');
      } else {
        toast.success('Request submitted. Weather appears normal, but your request will be reviewed.');
      }

      // Reset form
      setFormData({
        employeeName: user?.name || '',
        employeeId: user?.id || '',
        location: '',
        description: '',
        image: null
      });
      setImagePreview(null);

    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>
        <CloudRain size={24} />
        Weather Absence Report
      </FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="employeeName">Employee Name</Label>
          <Input
            type="text"
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            type="text"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            placeholder="Enter your employee ID"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="location">
            <MapPin size={16} style={{ marginRight: '5px' }} />
            Location (City, State)
          </Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., New York, NY"
            required
          />
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button type="button" onClick={useMyLocation} style={{
              background: '#f0f4ff',
              border: '1px solid #e1e5e9',
              color: '#333',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>Use my location</button>
            {weatherError && (
              <span style={{ color: '#d97706', fontSize: '0.9rem' }}>{weatherError}</span>
            )}
          </div>
          {fetchedWeather && (
            <div style={{ marginTop: '12px' }}>
              <WeatherInfo>
                <WeatherItem>
                  <WeatherIcon>{getWeatherIcon(fetchedWeather.condition)}</WeatherIcon>
                  <WeatherLabel>Condition</WeatherLabel>
                  <WeatherValue>{getWeatherDescription(fetchedWeather.condition)}</WeatherValue>
                </WeatherItem>
                <WeatherItem>
                  <WeatherLabel>Temperature</WeatherLabel>
                  <WeatherValue>{typeof fetchedWeather.temperature === 'number' ? `${fetchedWeather.temperature}°C` : '-'}</WeatherValue>
                </WeatherItem>
                <WeatherItem>
                  <WeatherLabel>Humidity</WeatherLabel>
                  <WeatherValue>{typeof fetchedWeather.humidity === 'number' ? `${fetchedWeather.humidity}%` : '-'}</WeatherValue>
                </WeatherItem>
                <WeatherItem>
                  <WeatherLabel>Wind Speed</WeatherLabel>
                  <WeatherValue>{typeof fetchedWeather.windSpeed === 'number' ? `${fetchedWeather.windSpeed} km/h` : '-'}</WeatherValue>
                </WeatherItem>
              </WeatherInfo>
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">
            <FileText size={16} style={{ marginRight: '5px' }} />
            Description of Weather Condition
          </Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the weather conditions preventing you from coming to office (e.g., heavy rain, flooding, storm, etc.)"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            <Camera size={16} style={{ marginRight: '5px' }} />
            Upload Photo (Optional)
          </Label>
          <FileInputContainer>
            <FileInput
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <FileInputLabel htmlFor="image">
              <Camera size={20} />
              {formData.image ? formData.image.name : 'Choose image file'}
            </FileInputLabel>
          </FileInputContainer>
          
          {imagePreview && (
            <ImagePreview>
              <PreviewImage src={imagePreview} alt="Weather condition preview" />
            </ImagePreview>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              Verifying Weather...
            </>
          ) : (
            <>
              <Send size={20} />
              Submit Weather Report
            </>
          )}
        </SubmitButton>
      </form>

      {verificationResult && (
        <VerificationResult type={verificationResult.isVerified ? 'verified' : 'warning'}>
          <VerificationHeader type={verificationResult.isVerified ? 'verified' : 'warning'}>
            {verificationResult.isVerified ? (
              <>
                <CheckCircle size={20} />
                Weather Condition Verified
              </>
            ) : (
              <>
                <Info size={20} />
                Weather Condition Checked
              </>
            )}
          </VerificationHeader>
          
          <p>
            {verificationResult.isVerified ? (
              <>
                <strong>⚠️ Verified:</strong> Employee {formData.employeeName} in {verificationResult.location} is experiencing severe weather conditions. Recommended for temporary remote work.
              </>
            ) : (
              <>
                <strong>ℹ️ Info:</strong> Employee {formData.employeeName} reported weather issues, but no severe alerts detected in {verificationResult.location}. Request will be reviewed by management.
              </>
            )}
          </p>

          <WeatherInfo>
            <WeatherItem>
              <WeatherIcon>{getWeatherIcon(verificationResult.weatherData.condition)}</WeatherIcon>
              <WeatherLabel>Condition</WeatherLabel>
              <WeatherValue>{getWeatherDescription(verificationResult.weatherData.condition)}</WeatherValue>
            </WeatherItem>
            <WeatherItem>
              <WeatherLabel>Temperature</WeatherLabel>
              <WeatherValue>{verificationResult.weatherData.temperature}°C</WeatherValue>
            </WeatherItem>
            <WeatherItem>
              <WeatherLabel>Humidity</WeatherLabel>
              <WeatherValue>{verificationResult.weatherData.humidity}%</WeatherValue>
            </WeatherItem>
            <WeatherItem>
              <WeatherLabel>Wind Speed</WeatherLabel>
              <WeatherValue>{verificationResult.weatherData.windSpeed} km/h</WeatherValue>
            </WeatherItem>
          </WeatherInfo>

          {verificationResult.weatherData.alerts && verificationResult.weatherData.alerts.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong>Weather Alerts:</strong>
              {verificationResult.weatherData.alerts.map((alert, index) => (
                <div key={index} style={{ 
                  marginTop: '5px', 
                  padding: '8px', 
                  background: 'white', 
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <strong>{alert.type.toUpperCase()}:</strong> {alert.message} ({alert.time})
                </div>
              ))}
            </div>
          )}
        </VerificationResult>
      )}
    </FormContainer>
  );
}

export default WeatherAbsenceForm;
