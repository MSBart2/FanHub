package com.fanhub.repository;

import com.fanhub.model.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Long> {
    
    List<Episode> findByShowId(Long showId);
    
    // INTENTIONAL BUG: Missing index on season_id, could cause N+1 query issues
    List<Episode> findBySeasonId(Long seasonId);
}
