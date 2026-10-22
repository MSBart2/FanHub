import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { quotesApi } from '../services/api';

const ACTIVE_SHOW_SLUG = 'breaking-bad';

const SpotlightCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #3eaf1a;
`;

const SpotlightLabel = styled.div`
  color: #3eaf1a;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const QuoteText = styled.blockquote`
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #1a1a1a;
`;

const MetaRow = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  color: #666;
`;

const CharacterName = styled.span`
  font-weight: 600;
  color: #0d0d0d;
`;

const ProgramName = styled.span`
  color: #666;
`;

const HelperText = styled.div`
  color: #666;
`;

function QuoteSpotlight() {
  const [spotlightQuote, setSpotlightQuote] = useState(null);
  const [currentShow, setCurrentShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpotlight = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await quotesApi.getSpotlight(ACTIVE_SHOW_SLUG);
        setSpotlightQuote(response.data.quote);
        setCurrentShow(response.data.program);
      } catch (err) {
        console.error('Failed to load quote spotlight:', err);
        setError('Quote spotlight is unavailable right now.');
      } finally {
        setLoading(false);
      }
    };

    loadSpotlight();
  }, []);

  if (loading) {
    return <HelperText>Loading spotlight...</HelperText>;
  }

  if (error) {
    return <HelperText>{error}</HelperText>;
  }

  if (!spotlightQuote) {
    return null;
  }

  return (
    <SpotlightCard>
      <SpotlightLabel>Quote Spotlight</SpotlightLabel>
      <QuoteText>"{spotlightQuote.quote_text}"</QuoteText>
      <MetaRow>
        <CharacterName>
          {spotlightQuote.character_name ? `- ${spotlightQuote.character_name}` : '- Unknown speaker'}
        </CharacterName>
        {currentShow && (
          <ProgramName>{currentShow.title}</ProgramName>
        )}
      </MetaRow>
    </SpotlightCard>
  );
}

export default QuoteSpotlight;
