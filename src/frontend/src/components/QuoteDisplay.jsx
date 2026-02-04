// QuoteDisplay component - CSS MODULES (yet another approach!)
// This file uses .module.css for styling

import React, { useState } from 'react';
import styles from '../styles/QuoteDisplay.module.css';

const QuoteDisplay = ({ quote, showCharacter = true, showEpisode = true, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(quote.likes_count || 0);

  const handleLike = async () => {
    if (liked) return; // Prevent double-liking
    
    try {
      if (onLike) {
        await onLike(quote.id);
      }
      setLiked(true);
      setLikesCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to like quote:', error);
    }
  };

  return (
    <div className={`${styles.quoteCard} ${quote.is_famous ? styles.famous : ''}`}>
      <div className={styles.quoteIcon}>"</div>
      <blockquote className={styles.quoteText}>
        {quote.quote_text}
      </blockquote>
      
      <div className={styles.attribution}>
        {showCharacter && quote.character_name && (
          <span className={styles.characterName}>
            — {quote.character_name}
          </span>
        )}
        {showEpisode && quote.episode_title && (
          <span className={styles.episodeInfo}>
            {quote.episode_title}
            {quote.season_number && quote.episode_number && (
              <span className={styles.episodeNumber}>
                (S{quote.season_number}E{quote.episode_number})
              </span>
            )}
          </span>
        )}
      </div>
      
      {quote.context && (
        <p className={styles.context}>
          Context: {quote.context}
        </p>
      )}
      
      <div className={styles.actions}>
        <button 
          className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
          onClick={handleLike}
          disabled={liked}
        >
          {liked ? '❤️' : '🤍'} {likesCount}
        </button>
        {quote.is_famous && (
          <span className={styles.famousBadge}>⭐ Famous Quote</span>
        )}
      </div>
    </div>
  );
};

export default QuoteDisplay;
