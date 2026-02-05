package com.fanhub.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

// INTENTIONAL BUG: Using @Getter/@Setter instead of @Data (inconsistent with Character.java)
@Getter
@Setter
@Entity
@Table(name = "episodes")
public class Episode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "show_id")
    private Long showId;
    
    @Column(name = "season_id")
    private Long seasonId;
    
    @Column(name = "episode_number", nullable = false)
    private Integer episodeNumber;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "air_date")
    private LocalDate airDate;
    
    @Column(name = "runtime_minutes")
    private Integer runtimeMinutes;
    
    private String director;
    
    private String writer;
    
    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;
    
    // INTENTIONAL BUG: Using Double instead of BigDecimal for money/rating
    private Double rating;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
