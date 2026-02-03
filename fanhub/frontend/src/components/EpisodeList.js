// EpisodeList component - INLINE STYLES (different from others!)
// This is yet another styling approach used in the codebase

import React from 'react';

// All inline styles - no CSS files or styled-components!
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  episodeCard: {
    display: 'flex',
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.3s ease',
  },
  thumbnail: {
    width: '150px',
    height: '100px',
    backgroundColor: '#ddd',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '0.8rem',
  },
  content: {
    padding: '1rem',
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#1a1a2e',
  },
  episodeNumber: {
    background: '#e94560',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  description: {
    margin: '0.5rem 0',
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#888',
  },
  rating: {
    color: '#f5c518',
    fontWeight: 'bold',
  },
};

// This is a functional component but doesn't use hooks like Header does
function EpisodeList({ episodes, onEpisodeClick }) {
  if (!episodes || episodes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        No episodes found.
      </div>
    );
  }

  // Helper function - defined inside component (not ideal)
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div style={styles.container}>
      {episodes.map((episode) => (
        <div 
          key={episode.id} 
          style={styles.episodeCard}
          onClick={() => onEpisodeClick && onEpisodeClick(episode)}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
            e.currentTarget.style.cursor = 'pointer';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          <div style={styles.thumbnail}>
            {episode.thumbnail_url ? (
              <img 
                src={episode.thumbnail_url} 
                alt={episode.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>No Image</span>
            )}
          </div>
          <div style={styles.content}>
            <div style={styles.header}>
              <h3 style={styles.title}>{episode.title}</h3>
              <span style={styles.episodeNumber}>
                S{episode.season_number || '?'}E{episode.episode_number}
              </span>
            </div>
            <p style={styles.description}>
              {episode.description || 'No description available.'}
            </p>
            <div style={styles.meta}>
              <span>📅 {formatDate(episode.air_date)}</span>
              {episode.runtime_minutes && (
                <span>⏱️ {episode.runtime_minutes} min</span>
              )}
              {episode.rating && (
                <span style={styles.rating}>⭐ {episode.rating}/10</span>
              )}
              {episode.director && (
                <span>🎬 {episode.director}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EpisodeList;
