package com.fanhub.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

// INTENTIONAL BUG: Using Lombok here but not in Show.java (inconsistency)
@Data
@Entity
@Table(name = "characters")
public class Character {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "show_id")
    private Long showId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "actor_name")
    private String actorName;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "is_main_character")
    private Boolean isMainCharacter;
    
    @Column(name = "first_appearance")
    private Long firstAppearance;
    
    private String status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
