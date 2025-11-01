import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Plane, Briefcase, Building, Eye, EyeOff, UserPlus, User, Lock, Home, ArrowLeft } from 'lucide-react';

// Main Container - Background Image
const LoginContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #0a1628 0%, #1a2838 50%, #2d3e4f 100%);
  background-image: url('https://images.unsplash.com/photo-1464822759844-d150ad6a3896?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
  
  /* Overlay for better text readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(10, 22, 40, 0.85) 0%, rgba(26, 40, 56, 0.75) 50%, rgba(45, 62, 79, 0.8) 100%);
    z-index: 0;
  }
`;

// Stars Background (optional overlay for night effect)
const StarsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  opacity: 0.3; /* Reduced opacity to show background image */
`;

const Star = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  width: ${props => props.size || 2}px;
  height: ${props => props.size || 2}px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  opacity: ${props => props.opacity || 0.8};
  animation: twinkle ${props => props.duration || 2}s infinite;
  
  @keyframes twinkle {
    0%, 100% { opacity: ${props => props.opacity || 0.8}; }
    50% { opacity: ${props => (props.opacity || 0.8) * 0.3}; }
  }
`;

// Moon (Hidden when using background image, or keep as decorative element)
const Moon = styled.div`
  position: absolute;
  top: 40px;
  right: 60px;
  width: 80px;
  height: 80px;
  background: rgba(212, 212, 212, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(212, 212, 212, 0.3);
  z-index: 2;
  display: none; /* Hidden to show background image */
  
  &::after {
    content: '';
    position: absolute;
    top: 15px;
    right: 15px;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
  }
`;

// Back to Home Button
const BackHomeButton = styled(Link)`
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

// Content Wrapper
const ContentWrapper = styled.div`
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 60px 40px 40px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

// Logo Section
const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LogoText = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  color: white;
  font-family: 'Inter', sans-serif;
  letter-spacing: 4px;
  margin: 0;
  position: relative;
  display: inline-block;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const LogoDecorations = styled.div`
  position: relative;
  display: inline-block;
`;

const DotDecoration = styled.span`
  position: absolute;
  top: -15px;
  left: ${props => props.left}px;
  width: 8px;
  height: 8px;
  background: #ffd700;
  border-radius: 50%;
`;

const SmileyDecoration = styled.span`
  position: absolute;
  top: -20px;
  left: ${props => props.left}px;
  font-size: 1.2rem;
  color: white;
`;

const UnderlineDecoration = styled.span`
  position: absolute;
  bottom: 10px;
  left: ${props => props.left}px;
  width: 60px;
  height: 2px;
  background: white;
`;

const Tagline = styled.p`
  color: white;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  margin-top: 15px;
  opacity: 0.9;
  letter-spacing: 1px;
`;

// Camping Scene (Hidden when using background image)
const CampingScene = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  margin: 40px 0;
  display: none; /* Hidden to show background image */
  
  @media (max-width: 768px) {
    height: 250px;
    margin: 30px 0;
  }
`;

const Mountains = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(to top, #2d3e4f 0%, #1a2838 50%, #0a1628 100%);
  clip-path: polygon(0% 100%, 10% 60%, 20% 70%, 30% 50%, 40% 65%, 50% 45%, 60% 55%, 70% 40%, 80% 50%, 90% 45%, 100% 55%, 100% 100%);
  z-index: 1;
`;

const Forest = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
  background: #1a3d2e;
  clip-path: polygon(0% 100%, 5% 80%, 10% 100%, 15% 75%, 20% 95%, 25% 85%, 30% 100%, 35% 70%, 40% 90%, 45% 80%, 50% 100%, 55% 75%, 60% 95%, 65% 85%, 70% 100%, 75% 70%, 80% 90%, 85% 80%, 90% 100%, 95% 75%, 100% 85%, 100% 100%);
  z-index: 2;
`;

const Ground = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  background: #2d2d2d;
  z-index: 3;
`;

const Campfire = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 60px;
  z-index: 4;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    background: #ff8c00;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 50px;
    background: #ffd700;
    clip-path: polygon(30% 100%, 50% 20%, 70% 100%);
    animation: flicker 1.5s infinite;
  }
  
  @keyframes flicker {
    0%, 100% { transform: translateX(-50%) scaleY(1); }
    50% { transform: translateX(-52%) scaleY(1.1); }
  }
`;

const Car = styled.div`
  position: absolute;
  bottom: 80px;
  left: 20%;
  width: 60px;
  height: 35px;
  background: white;
  clip-path: polygon(10% 0%, 90% 0%, 100% 30%, 95% 60%, 85% 60%, 80% 100%, 20% 100%, 15% 60%, 5% 60%, 0% 30%);
  z-index: 4;
`;

const Tent = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20%;
  width: 50px;
  height: 60px;
  background: #d2691e;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  z-index: 4;
  
  &::before {
    content: '';
    position: absolute;
    top: 40%;
    left: 10px;
    width: 15px;
    height: 15px;
    background: #1a1a1a;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 40%;
    right: 10px;
    width: 15px;
    height: 15px;
    background: #1a1a1a;
  }
`;

// Form Section
const FormSection = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 40px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid #9d7bd8;
  color: white;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-bottom-color: #b895e6;
    
    + .input-icon {
      color: #b895e6;
    }
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #9d7bd8;
  transition: color 0.3s ease;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 15px 25px;
  background: transparent;
  color: white;
  border: 2px solid #9d7bd8;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(157, 123, 216, 0.2);
    border-color: #b895e6;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  margin-top: 15px;
  transition: color 0.3s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

// Role Selector (Hidden by default, shown when needed)
const RoleSelectorWrapper = styled.div`
  margin-bottom: 20px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const RoleSelector = styled.div`
  display: flex;
  gap: 10px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #9d7bd8;
`;

const RoleButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => props.active ? '#9d7bd8' : 'transparent'};
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  
  &:hover {
    background: ${props => props.active ? '#b895e6' : 'rgba(157, 123, 216, 0.2)'};
  }
`;

function Login() {
  const [selectedRole, setSelectedRole] = useState('traveler');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isSignUp) {
      if (!name) {
        alert('Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        await register(email, password, selectedRole, name);
      } else {
        await login(email, password, selectedRole);
      }
      navigate(selectedRole === 'traveler' ? '/traveler' : selectedRole === 'admin' ? '/company' : '/employee');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate stars
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    duration: Math.random() * 3 + 1,
  }));

  return (
    <LoginContainer>
      <StarsContainer>
        {stars.map(star => (
          <Star
            key={star.id}
            top={star.top}
            left={star.left}
            size={star.size}
            opacity={star.opacity}
            duration={star.duration}
          />
        ))}
      </StarsContainer>
      
      <Moon />
      
      <BackHomeButton to="/">
        <ArrowLeft size={18} />
        Back to Home
      </BackHomeButton>

      <ContentWrapper>
        <div>
          <LogoSection>
            <LogoDecorations>
              <LogoText>TRAVEL</LogoText>
              <DotDecoration left={25} />
              <DotDecoration left={35} />
              <SmileyDecoration left={125}>😊</SmileyDecoration>
              <UnderlineDecoration left={205} />
            </LogoDecorations>
            <Tagline>Connecting Journeys with ClimateHub</Tagline>
          </LogoSection>

          <CampingScene>
            <Mountains />
            <Forest />
            <Ground />
            <Campfire />
            <Car />
            <Tent />
          </CampingScene>
        </div>

        <FormSection>
          <RoleSelectorWrapper show={true}>
            <RoleSelector>
              <RoleButton
                type="button"
                active={selectedRole === 'traveler'}
                onClick={() => setSelectedRole('traveler')}
              >
                <Plane size={16} />
                Traveler
              </RoleButton>
              <RoleButton
                type="button"
                active={selectedRole === 'employee'}
                onClick={() => setSelectedRole('employee')}
              >
                <Briefcase size={16} />
                Employee
              </RoleButton>
              <RoleButton
                type="button"
                active={selectedRole === 'admin'}
                onClick={() => setSelectedRole('admin')}
              >
                <Building size={16} />
                Admin
              </RoleButton>
            </RoleSelector>
          </RoleSelectorWrapper>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <InputIcon className="input-icon">
                  <User size={20} />
                </InputIcon>
              </InputGroup>
            )}
            
            <InputGroup>
              <Input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputIcon className="input-icon">
                <User size={20} />
              </InputIcon>
            </InputGroup>

            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputIcon className="input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Lock size={20} />}
              </InputIcon>
            </InputGroup>

            {isSignUp && (
              <InputGroup>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <InputIcon className="input-icon">
                  <Lock size={20} />
                </InputIcon>
              </InputGroup>
            )}

            <ButtonGroup>
              <ActionButton
                type="button"
                onClick={() => {
                  if (!isSignUp) {
                    setIsSignUp(true);
                  }
                }}
                disabled={isSignUp || loading}
                style={{ 
                  background: isSignUp ? 'rgba(157, 123, 216, 0.3)' : 'transparent',
                  borderColor: isSignUp ? '#b895e6' : '#9d7bd8'
                }}
              >
                Sign up
              </ActionButton>
              <ActionButton
                type="submit"
                disabled={loading}
                style={{ 
                  background: !isSignUp ? 'rgba(157, 123, 216, 0.3)' : 'transparent',
                  borderColor: !isSignUp ? '#b895e6' : '#9d7bd8'
                }}
              >
                {loading ? (isSignUp ? 'Creating...' : 'Signing in...') : 'Sign in'}
              </ActionButton>
            </ButtonGroup>
            
            {isSignUp && (
              <ActionButton
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  background: 'rgba(157, 123, 216, 0.3)',
                  borderColor: '#b895e6'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </ActionButton>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '15px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              {isSignUp ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                      setName('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9d7bd8',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem'
                    }}
                  >
                    Sign in instead
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                      setName('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9d7bd8',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem'
                    }}
                  >
                    Sign up
                  </button>
                </span>
              )}
            </div>
          </form>

          <ForgotPassword href="#" onClick={(e) => { e.preventDefault(); }}>
            Forgot Password?
          </ForgotPassword>
        </FormSection>
      </ContentWrapper>
    </LoginContainer>
  );
}

export default Login;
