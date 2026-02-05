package com.fanhub.service;

import com.fanhub.model.Episode;
import com.fanhub.repository.EpisodeRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EpisodeService {
    
    private final EpisodeRepository episodeRepository;
    
    // Using constructor injection here (inconsistent with CharacterService)
    public EpisodeService(EpisodeRepository episodeRepository) {
        this.episodeRepository = episodeRepository;
    }
    
    public List<Episode> getAllEpisodes() {
        return episodeRepository.findAll();
    }
    
    // INTENTIONAL BUG: Cache key doesn't include seasonId parameter
    // This mirrors the Node.js cache bug
    @Cacheable(value = "episodes")
    public List<Episode> getEpisodesBySeasonId(Long seasonId) {
        return episodeRepository.findBySeasonId(seasonId);
    }
    
    public Optional<Episode> getEpisodeById(Long id) {
        // This one correctly returns Optional (inconsistent approach)
        return episodeRepository.findById(id);
    }
    
    public Episode createEpisode(Episode episode) {
        // INTENTIONAL BUG: No validation
        return episodeRepository.save(episode);
    }
    
    public Episode updateEpisode(Long id, Episode episode) {
        episode.setId(id);
        return episodeRepository.save(episode);
    }
    
    public void deleteEpisode(Long id) {
        episodeRepository.deleteById(id);
    }
}
