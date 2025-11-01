import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';

// Outer Container - Dark Teal/Blue Background
const OuterContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #1a4d5c; /* Dark teal/blue */
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Main Content Area - Centered with rounded corners
const MainContent = styled.div`
  width: 100%;
  max-width: 1400px;
  height: 90vh;
  min-height: 700px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

// Background Image Container
const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  /* Fallback gradient if image doesn't load */
  background: linear-gradient(135deg, #2d5a6f 0%, #3a7a8f 50%, #4a9aaf 100%);
`;

// Diagonal Overlay - Dark grey/black overlay on right 2/3
const DiagonalOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 65%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(30, 30, 30, 0.9) 50%,
    rgba(20, 20, 20, 0.85) 100%
  );
  clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 1;
`;

// Header Section
const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 30px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const Logo = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const MenuIcon = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

// Hero Section - Main Content Area
const HeroSection = styled.div`
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  z-index: 5;
  max-width: 600px;
`;

const HeroText = styled.div`
  margin-bottom: 40px;
`;

const ExploreText = styled.h1`
  font-size: 6rem;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 2px white;
  text-stroke: 2px white;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 2px;
  line-height: 1;
  margin: 0;
  
  @media (max-width: 1200px) {
    font-size: 4.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const AndText = styled.h2`
  font-size: 4rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 2px;
  line-height: 1;
  margin: 10px 0;
  
  @media (max-width: 1200px) {
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TravelText = styled.h2`
  font-size: 4rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 2px;
  line-height: 1;
  margin: 0;
  
  @media (max-width: 1200px) {
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
`;

const SignInButton = styled(Link)`
  background: #4a90e2; /* Light blue */
  color: white;
  border: 2px solid #357abd;
  padding: 15px 35px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    background: #357abd;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
  }
`;

const LogInButton = styled(Link)`
  background: #dc3545; /* Red */
  color: white;
  border: none;
  padding: 15px 35px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
  }
`;

// Social Media Links - Left Vertical
const SocialLinks = styled.div`
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SocialLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 400;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 2px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

// Search Bar - Bottom Left
const SearchContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  color: white;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  padding: 8px 0;
  width: 200px;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    text-transform: lowercase;
  }
  
  &:focus {
    border-bottom-color: white;
  }
`;

const SearchIcon = styled(Search)`
  color: white;
  cursor: pointer;
  
  &:hover {
    opacity: 0.7;
  }
`;

// Scroll Indicator - Bottom Center
const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-50%) translateY(-5px);
  }
`;

function HomePage() {
  return (
    <OuterContainer>
      <MainContent>
        {/* Background Image */}
        <BackgroundImage />
        
        {/* Diagonal Overlay */}
        <DiagonalOverlay />
        
        {/* Header */}
        <Header>
          <Logo>yourlogo.</Logo>
          <Navigation>
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#service">Service</NavLink>
            <NavLink href="#catalog">Catalog</NavLink>
            <NavLink href="#contact">Contact Us</NavLink>
            <MenuIcon aria-label="More options">
              <MoreVertical size={20} />
            </MenuIcon>
          </Navigation>
        </Header>
        
        {/* Hero Section */}
        <HeroSection>
          <HeroText>
            <ExploreText>EXPLORE</ExploreText>
            <AndText>AND</AndText>
            <TravelText>TRAVEL BASED ON WEATHER</TravelText>
          </HeroText>
          <ButtonContainer>
            <SignInButton to="/login">SIGN IN</SignInButton>
            <LogInButton to="/login">LOG IN</LogInButton>
          </ButtonContainer>
        </HeroSection>
        
        {/* Social Media Links - Left Vertical */}
        <SocialLinks>
          <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            TWITTER
          </SocialLink>
          <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            FACEBOOK
          </SocialLink>
          <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            INSTAGRAM
          </SocialLink>
        </SocialLinks>
        
        {/* Search Bar - Bottom Left */}
        <SearchContainer>
          <SearchInput type="text" placeholder="search" />
          <SearchIcon size={20} />
        </SearchContainer>
        
        {/* Scroll Indicator - Bottom Center */}
        <ScrollIndicator>
          <ChevronDown size={24} color="white" />
        </ScrollIndicator>
      </MainContent>
    </OuterContainer>
  );
}

export default HomePage;
