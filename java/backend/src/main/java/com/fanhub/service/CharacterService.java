package com.fanhub.service;

import com.fanhub.model.Character;
import com.fanhub.repository.CharacterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CharacterService {
    
    // INTENTIONAL BUG: Field injection instead of constructor injection
    @Autowired
    private CharacterRepository characterRepository;
    
    public List<Character> getAllCharacters() {
        // INTENTIONAL BUG: No pagination, returns all characters
        return characterRepository.findAll();
    }
    
    public Character getCharacterById(Long id) {
        // INTENTIONAL BUG: Using .get() without checking isPresent()
        return characterRepository.findById(id).get();
    }
    
    public List<Character> getCharactersByShowId(Long showId) {
        return characterRepository.findByShowId(showId);
    }
    
    public List<Character> searchCharacters(String query) {
        // INTENTIONAL BUG: No null check on query parameter
        return characterRepository.findByNameContainingIgnoreCase(query);
    }
    
    public Character createCharacter(Character character) {
        // INTENTIONAL BUG: No validation that character doesn't already exist
        // This allows duplicate Jesse Pinkman!
        return characterRepository.save(character);
    }
    
    public Character updateCharacter(Long id, Character character) {
        // INTENTIONAL BUG: No check if character exists before updating
        character.setId(id);
        return characterRepository.save(character);
    }
    
    public void deleteCharacter(Long id) {
        // INTENTIONAL BUG: No check if character exists before deleting
        characterRepository.deleteById(id);
    }
}
