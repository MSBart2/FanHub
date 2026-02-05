package com.fanhub.controller;

import com.fanhub.model.Show;
import com.fanhub.service.ShowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "*")
public class ShowController {
    
    private final ShowService showService;
    
    public ShowController(ShowService showService) {
        this.showService = showService;
    }
    
    @GetMapping
    public List<Show> getAllShows() {
        // INTENTIONAL BUG: Different return type than episodes endpoint
        return showService.getAllShows();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getShowById(@PathVariable Long id) {
        try {
            Show show = showService.getShowById(id);
            
            if (show == null) {
                // INTENTIONAL BUG: Inconsistent error response format
                Map<String, String> error = new HashMap<>();
                error.put("error", "Show not found");
                return ResponseEntity.status(404).body(error);
            }
            
            return ResponseEntity.ok(show);
        } catch (Exception e) {
            // INTENTIONAL BUG: Exposing exception details in production
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<Show> createShow(@RequestBody Show show) {
        // INTENTIONAL BUG: No validation that title is provided
        Show created = showService.createShow(show);
        return ResponseEntity.status(201).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Show> updateShow(@PathVariable Long id, @RequestBody Show show) {
        Show updated = showService.updateShow(id, show);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.noContent().build();
    }
}
