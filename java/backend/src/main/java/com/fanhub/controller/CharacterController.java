package com.fanhub.controller;

import com.fanhub.model.Character;
import com.fanhub.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "*")  // INTENTIONAL BUG: CORS wide open
public class CharacterController {
    
    @Autowired
    private CharacterService characterService;
    
    // INTENTIONAL BUG: No try-catch, exceptions will be exposed to client
    @GetMapping
    public List<Character> getAllCharacters(
            @RequestParam(required = false) Long showId,
            @RequestParam(required = false) String search) {
        
        if (search != null) {
            return characterService.searchCharacters(search);
        }
        
        if (showId != null) {
            return characterService.getCharactersByShowId(showId);
        }
        
        // INTENTIONAL BUG: Returns all characters without pagination
        return characterService.getAllCharacters();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Character> getCharacterById(@PathVariable Long id) {
        // INTENTIONAL BUG: Will throw exception if character not found
        Character character = characterService.getCharacterById(id);
        return ResponseEntity.ok(character);
    }
    
    @PostMapping
    public Character createCharacter(@RequestBody Character character) {
        // INTENTIONAL BUG: Returns 200 instead of 201 (inconsistent with shows)
        // INTENTIONAL BUG: No validation of required fields
        return characterService.createCharacter(character);
    }
    
    @PatchMapping("/{id}")  // INTENTIONAL BUG: Using PATCH while others use PUT
    public ResponseEntity<Character> updateCharacter(
            @PathVariable Long id,
            @RequestBody Character character) {
        
        Character updated = characterService.updateCharacter(id, character);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public void deleteCharacter(@PathVariable Long id) {
        // INTENTIONAL BUG: Returns void with no status, no error handling
        characterService.deleteCharacter(id);
    }
}
