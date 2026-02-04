// Home page - displays show overview and featured content
// TODO: Add actual show data, this is all placeholder

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { showsApi, quotesApi } from '../services/api';
import QuoteDisplay from '../components/QuoteDisplay';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #aaa;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #e94560;
  display: inline-block;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #e94560;
`;

const StatLabel = styled.div`
  color: #666;
  margin-top: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

// Home component
function Home() {
  const [show, setShow] = useState(null);
  const [randomQuote, setRandomQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get show data (assuming ID 1 for now)
      const showResponse = await showsApi.getFull(1);
      setShow(showResponse.data);

      // Get a random famous quote
      try {
        const quoteResponse = await quotesApi.getRandom({ famous_only: 'true' });
        setRandomQuote(quoteResponse.data);
      } catch (e) {
        // Quote might not exist, that's okay
        console.log('No quotes available');
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load show data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteLike = async (quoteId) => {
    await quotesApi.like(quoteId);
  };

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <div>
      <HeroSection>
        <Title>{show?.title || 'Welcome to FanHub'}</Title>
        <Subtitle>
          {show?.description || 'Your ultimate destination for everything about your favorite show!'}
        </Subtitle>
      </HeroSection>

      <StatsGrid>
        <StatCard>
          <StatNumber>{show?.seasons?.length || 0}</StatNumber>
          <StatLabel>Seasons</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{show?.episodes?.length || 0}</StatNumber>
          <StatLabel>Episodes</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{show?.characters?.length || 0}</StatNumber>
          <StatLabel>Characters</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{show?.start_year || '—'}</StatNumber>
          <StatLabel>First Aired</StatLabel>
        </StatCard>
      </StatsGrid>

      {randomQuote && (
        <Section>
          <SectionTitle>Quote of the Day</SectionTitle>
          <QuoteDisplay 
            quote={randomQuote} 
            onLike={handleQuoteLike}
          />
        </Section>
      )}

      <Section>
        <SectionTitle>About the Show</SectionTitle>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <p>{show?.description || 'No description available. Add one in the admin panel!'}</p>
          <div style={{ marginTop: '1rem', color: '#666' }}>
            <p><strong>Genre:</strong> {show?.genre || 'Unknown'}</p>
            <p><strong>Network:</strong> {show?.network || 'Unknown'}</p>
            <p><strong>Years:</strong> {show?.start_year || '?'} - {show?.end_year || 'Present'}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Home;
