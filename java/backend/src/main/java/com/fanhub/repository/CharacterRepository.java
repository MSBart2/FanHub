package com.fanhub.repository;

import com.fanhub.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// INTENTIONAL BUG: Missing @Repository annotation (inconsistent with ShowRepository)
public interface CharacterRepository extends JpaRepository<Character, Long> {
    
    List<Character> findByShowId(Long showId);
    
    // INTENTIONAL BUG: Method that could cause issues with duplicate Jesse Pinkman
    // Should use unique constraint or handle duplicates
    Character findByName(String name);
    
    List<Character> findByNameContainingIgnoreCase(String search);
}
