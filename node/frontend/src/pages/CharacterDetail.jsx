import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { charactersApi } from '../services/api';

const Container = styled.div`
  padding: 1rem 0;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #3eaf1a;
`;

const LoadingMessage = styled.p`
  padding: 3rem;
  text-align: center;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1.5rem;
  border-radius: 8px;
`;

const Profile = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  background: white;
  color: #0d0d0d;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  h1, h2 {
    color: #0d0d0d;
  }
`;

const Portrait = styled.div`
  width: 250px;
  max-width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  background: #e0e0e0;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Initials = styled.div`
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

const ProfileText = styled.div`
  flex: 1 1 250px;
  min-width: 0;
  overflow-wrap: anywhere;

  h1 {
    margin-top: 0;
    font-size: 2rem;
  }
`;

const Facts = styled.dl`
  dt {
    font-weight: bold;
    margin-top: 1rem;
  }

  dd {
    margin: 0.25rem 0 0;
  }
`;

const Biography = styled.p`
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Appearances = styled.section`
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  color: #0d0d0d;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  h2, h3 {
    color: #0d0d0d;
  }

  h2 {
    margin-top: 0;
  }
`;

const EpisodeItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    padding: 1rem 0;
    border-top: 1px solid #eee;
  }

  h3 {
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0.25rem 0;
    color: #666;
  }
`;

function CharacterDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState({
    id,
    character: null,
    loading: true,
    error: null,
    imageFailed: false,
  });

  useEffect(() => {
    let active = true;
    setDetail({
      id,
      character: null,
      loading: true,
      error: null,
      imageFailed: false,
    });

    const loadCharacter = async () => {
      try {
        const response = await charactersApi.getById(id);
        if (!active) return;
        setDetail({
          id,
          character: response.data,
          loading: false,
          error: null,
          imageFailed: false,
        });
      } catch (err) {
        if (!active) return;
        setDetail({
          id,
          character: null,
          loading: false,
          error: err.response?.status === 404 ? 'not-found' : 'request-failed',
          imageFailed: false,
        });
      }
    };

    loadCharacter();
    return () => {
      active = false;
    };
  }, [id]);

  // Route changes render before the new effect runs; never show the previous profile.
  const loading = detail.id !== id || detail.loading;
  const character = !loading && !detail.error ? detail.character : null;
  const name = character?.name?.trim() || 'Unknown character';
  const initials = character?.name?.trim()
    ? name.split(/\s+/).map(part => part[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const episodes = Array.isArray(character?.episodes) ? character.episodes : [];

  return (
    <Container>
      <BackLink to="/characters">Back to Characters</BackLink>
      {loading ? (
        <LoadingMessage role="status">Loading character...</LoadingMessage>
      ) : detail.error ? (
        <ErrorMessage role="alert">
          <h1>{detail.error === 'not-found' ? 'Character not found' : 'Unable to load character'}</h1>
          <p>
            {detail.error === 'not-found'
              ? 'This character could not be found.'
              : 'Failed to load character details. Please try again later.'}
          </p>
        </ErrorMessage>
      ) : character ? (
        <>
          <Profile aria-labelledby="character-name">
            <Portrait>
              {character.image_url && !detail.imageFailed ? (
                <CharacterImage
                  src={character.image_url}
                  alt={name}
                  onError={() => setDetail(current => (
                    current.id === id ? { ...current, imageFailed: true } : current
                  ))}
                />
              ) : (
                <Initials role="img" aria-label={`${name} initials`}>{initials}</Initials>
              )}
            </Portrait>
            <ProfileText>
              <h1 id="character-name">{name}</h1>
              <p>Played by {character.actor_name?.trim() || 'Unknown actor'}</p>
              <Facts>
                <dt>Status</dt>
                <dd>{character.status?.trim() || 'Unknown'}</dd>
                <dt>Role</dt>
                <dd>
                  {character.is_main_character === 1
                    ? 'Main character'
                    : character.is_main_character === 0 ? 'Supporting character' : 'Unknown role'}
                </dd>
              </Facts>
              <h2>Biography</h2>
              <Biography>{character.bio?.trim() || 'No biography available.'}</Biography>
            </ProfileText>
          </Profile>
          <Appearances aria-labelledby="appearances-heading">
            <h2 id="appearances-heading">Episode appearances</h2>
            {episodes.length === 0 ? (
              <p>No appearances are recorded for this character.</p>
            ) : (
              <EpisodeItems>
                {episodes.map(episode => (
                  <li key={episode.id}>
                    <h3>{episode.title?.trim() || 'Untitled episode'}</h3>
                    <p>Episode {episode.episode_number ?? 'number unknown'}</p>
                    <p>
                      {episode.is_featured === 1
                        ? 'Featured appearance'
                        : episode.is_featured === 0 ? 'Not featured' : 'Featured status unknown'}
                    </p>
                  </li>
                ))}
              </EpisodeItems>
            )}
          </Appearances>
        </>
      ) : null}
    </Container>
  );
}

export default CharacterDetail;
