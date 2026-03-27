// Home page - displays show overview and featured content
// TODO: Add actual show data, this is all placeholder

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { showsApi, quotesApi } from '../services/api';
import QuoteDisplay from '../components/QuoteDisplay';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1f0d 100%);
  color: white;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  margin: -2rem -2rem 0;
`;

const HeroLogo = styled.div`
  font-size: 1rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  opacity: 0.7;
`;

const LogoFan = styled.span`
  color: #fff;
  font-weight: 300;
`;

const LogoHub = styled.span`
  color: #62d962;
  font-weight: 700;
`;

const ShowTitle = styled.h1`
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
`;

const ElementTag = styled.span`
  display: inline-block;
  background: #62d962;
  color: #0a0a0a;
  font-size: 0.5em;
  font-weight: 900;
  padding: 0.05em 0.2em;
  vertical-align: super;
  line-height: 1;
  border-radius: 2px;
  margin-right: 0.05em;
`;

const Tagline = styled.p`
  font-size: 1.4rem;
  color: #aaa;
  font-style: italic;
  margin-bottom: 2.5rem;
  letter-spacing: 0.05em;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const BtnHero = styled.a`
  display: inline-block;
  background: #62d962;
  color: #0a0a0a;
  text-decoration: none;
  padding: 0.85rem 2rem;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 3px;
  transition: background 0.2s, transform 0.1s;

  &:hover {
    background: #80e880;
    transform: translateY(-1px);
    color: #0a0a0a;
  }
`;

const BtnHeroOutline = styled(BtnHero)`
  background: transparent;
  color: #62d962;
  border: 2px solid #62d962;

  &:hover {
    background: rgba(98, 217, 98, 0.1);
    color: #62d962;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #62d962;
  display: inline-block;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-top: 3px solid #62d962;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #3eaf1a;
`;

const StatLabel = styled.div`
  color: #888;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
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
        <div>
          <HeroLogo><LogoFan>Fan</LogoFan><LogoHub>Hub</LogoHub></HeroLogo>
          <ShowTitle>
            <ElementTag>Br</ElementTag>eaking <ElementTag>Ba</ElementTag>d
          </ShowTitle>
          <Tagline>I am the one who knocks.</Tagline>
          <HeroActions>
            <BtnHero href="/characters">Meet the Characters</BtnHero>
            <BtnHeroOutline href="/episodes">Browse Episodes</BtnHeroOutline>
          </HeroActions>
        </div>
      </HeroSection>

      <StatsGrid>
        <StatCard>
          <StatNumber>{show?.seasons?.length || 0}</StatNumber>
          <StatLabel>Seasons</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{show?.characters?.length || 0}</StatNumber>
          <StatLabel>Characters</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{show?.episodes?.length || 0}</StatNumber>
          <StatLabel>Episodes</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{show?.network || '—'}</StatNumber>
          <StatLabel>Network</StatLabel>
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
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #2a2a2a'
        }}>
          <p>{show?.description || 'No description available. Add one in the admin panel!'}</p>
          <div style={{ marginTop: '1rem', color: '#888' }}>
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
