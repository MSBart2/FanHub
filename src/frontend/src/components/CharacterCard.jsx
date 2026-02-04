// CharacterCard component - uses STYLED-COMPONENTS
// Different naming convention (.jsx) than Footer (.js)

import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: #e0e0e0;
  overflow: hidden;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 3rem;
  font-weight: bold;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CharacterName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #1a1a2e;
  font-size: 1.2rem;
`;

const ActorName = styled.p`
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$status) {
      case 'alive': return '#4caf50';
      case 'deceased': return '#f44336';
      default: return '#9e9e9e';
    }
  }};
  color: white;
`;

const MainCharacterBadge = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #e94560;
  color: white;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
`;

// Functional component
const CharacterCard = ({ character, onClick }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card onClick={() => onClick && onClick(character)}>
      <ImageWrapper>
        {character.image_url ? (
          <CharacterImage 
            src={character.image_url} 
            alt={character.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <PlaceholderImage style={{ display: character.image_url ? 'none' : 'flex' }}>
          {getInitials(character.name)}
        </PlaceholderImage>
      </ImageWrapper>
      <CardContent>
        <CharacterName>
          {character.name}
          {character.is_main_character && <MainCharacterBadge>MAIN</MainCharacterBadge>}
        </CharacterName>
        <ActorName>Played by {character.actor_name || 'Unknown'}</ActorName>
        <StatusBadge $status={character.status}>
          {character.status || 'Unknown'}
        </StatusBadge>
      </CardContent>
    </Card>
  );
};

export default CharacterCard;
