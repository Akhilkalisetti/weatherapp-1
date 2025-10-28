import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plane, Briefcase, Building, Eye, EyeOff, UserPlus } from 'lucide-react';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
`;

const RoleSelector = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e1e5e9;
`;

const RoleButton = styled.button`
  flex: 1;
  padding: 15px;
  border: none;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#f8f9fa'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 5px;
  
  &:hover {
    color: #333;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
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

const DemoInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 15px;
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const AuthToggle = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
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

  return (
    <LoginContainer>
      <LoginCard>
        <Title>{isSignUp ? 'Create Account' : 'Welcome Back'}</Title>
        
        <RoleSelector>
          <RoleButton
            type="button"
            active={selectedRole === 'traveler'}
            onClick={() => setSelectedRole('traveler')}
          >
            <Plane size={20} />
            Traveler
          </RoleButton>
          <RoleButton
            type="button"
            active={selectedRole === 'employee'}
            onClick={() => setSelectedRole('employee')}
          >
            <Briefcase size={20} />
            Employee
          </RoleButton>
          <RoleButton
            type="button"
            active={selectedRole === 'admin'}
            onClick={() => setSelectedRole('admin')}
          >
            <Building size={20} />
            Admin
          </RoleButton>
        </RoleSelector>

        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <InputGroup>
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>
          )}
          
          <InputGroup>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
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
            </InputGroup>
          )}

          <LoginButton type="submit" disabled={loading}>
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </LoginButton>
        </Form>

        <AuthToggle>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <SignUpButton 
            type="button" 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setName('');
            }}
          >
            <UserPlus size={20} />
            {isSignUp ? 'Sign In Instead' : 'Sign Up'}
          </SignUpButton>
        </AuthToggle>

        <DemoInfo>
          <strong>Demo:</strong> Use any email/password combination to {isSignUp ? 'create an account' : 'sign in'}
        </DemoInfo>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
