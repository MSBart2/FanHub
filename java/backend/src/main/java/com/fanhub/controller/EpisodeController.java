package com.fanhub.controller;

import com.fanhub.model.Episode;
import com.fanhub.service.EpisodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/episodes")
@CrossOrigin(origins = "*")
public class EpisodeController {
    
    private final EpisodeService episodeService;
    
    public EpisodeController(EpisodeService episodeService) {
        this.episodeService = episodeService;
    }
    
    @GetMapping
    public Map<String, Object> getEpisodes(@RequestParam(required = false) Long seasonId) {
        // INTENTIONAL BUG: Different response format than characters endpoint
        Map<String, Object> response = new HashMap<>();
        
        List<Episode> episodes;
        if (seasonId != null) {
            // The cache bug is in the service layer (cache key doesn't include seasonId)
            episodes = episodeService.getEpisodesBySeasonId(seasonId);
        } else {
            episodes = episodeService.getAllEpisodes();
        }
        
        response.put("success", true);
        response.put("count", episodes.size());
        response.put("data", episodes);
        
        return response;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEpisodeById(@PathVariable Long id) {
        // INTENTIONAL BUG: Using Optional but wrapping in ResponseEntity awkwardly
        return episodeService.getEpisodeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Episode> createEpisode(@RequestBody Episode episode) {
        // This one correctly returns 201 (inconsistent with CharacterController)
        Episode created = episodeService.createEpisode(episode);
        return ResponseEntity.status(201).body(created);
    }
    
    @PutMapping("/{id}")  // Using PUT (different from CharacterController's PATCH)
    public ResponseEntity<Episode> updateEpisode(
            @PathVariable Long id,
            @RequestBody Episode episode) {
        
        Episode updated = episodeService.updateEpisode(id, episode);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpisode(@PathVariable Long id) {
        episodeService.deleteEpisode(id);
        return ResponseEntity.noContent().build();
    }
}
