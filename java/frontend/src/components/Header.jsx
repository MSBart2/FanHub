// Header component - FUNCTIONAL with styled-components
// This is ONE style approach (others use different approaches!)

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    color: #e94560;
    text-decoration: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.$active ? '#e94560' : 'white'};
  text-decoration: none;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e94560;
    text-decoration: none;
  }
`;

// Functional component with hooks
const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <HeaderWrapper>
      <Nav>
        <Logo to="/">FanHub</Logo>
        <NavLinks>
          <NavLink to="/" $active={isActive('/')}>Home</NavLink>
          <NavLink to="/characters" $active={isActive('/characters')}>Characters</NavLink>
          <NavLink to="/episodes" $active={isActive('/episodes')}>Episodes</NavLink>
          <NavLink to="/about" $active={isActive('/about')}>About</NavLink>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
