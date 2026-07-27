import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { quotesApi } from '../services/api';

const SHOW_SLUG = 'breaking-bad';

const SpotlightCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-left: 3px solid #62d962;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SpotlightLabel = styled.div`
  color: #62d962;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
`;

const SpotlightText = styled.blockquote`
  color: #ffffff;
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.7;
  margin: 0;
`;

const SpotlightMeta = styled.div`
  color: #9aa09a;
  margin-top: 1rem;
`;

function QuoteSpotlight() {
  const [spotlightQuote, setSpotlightQuote] = useState(null);
  const [currentShow, setCurrentShow] = useState(null);

  useEffect(() => {
    const loadSpotlight = async () => {
      try {
        const response = await quotesApi.getSpotlight(SHOW_SLUG);
        setSpotlightQuote(response.data.quote);
        setCurrentShow(response.data.program);
      } catch (error) {
        console.error('Failed to load quote spotlight:', error);
      }
    };

    loadSpotlight();
  }, []);

  if (!spotlightQuote || !currentShow) {
    return null;
  }

  return (
    <SpotlightCard>
      <SpotlightLabel>Quote Spotlight</SpotlightLabel>
      <SpotlightText>"{spotlightQuote.quote_text}"</SpotlightText>
      <SpotlightMeta>
        — {spotlightQuote.character_name || 'Unknown'}
        <span> · {currentShow.title}</span>
      </SpotlightMeta>
    </SpotlightCard>
  );
}

export default QuoteSpotlight;
