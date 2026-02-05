package com.fanhub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "quotes")
public class Quote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "show_id")
    private Long showId;
    
    @Column(name = "character_id")
    private Long characterId;
    
    @Column(name = "episode_id")
    private Long episodeId;
    
    @Column(name = "quote_text", nullable = false, columnDefinition = "TEXT")
    private String quoteText;
    
    @Column(columnDefinition = "TEXT")
    private String context;
    
    @Column(name = "is_famous")
    private Boolean isFamous;
    
    @Column(name = "likes_count")
    private Integer likesCount;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
