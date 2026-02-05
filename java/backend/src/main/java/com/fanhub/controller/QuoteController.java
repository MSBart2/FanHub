package com.fanhub.controller;

import com.fanhub.model.Quote;
import com.fanhub.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
@CrossOrigin(origins = "*")
public class QuoteController {
    
    @Autowired
    private QuoteService quoteService;
    
    @GetMapping
    public List<Quote> getAllQuotes(@RequestParam(required = false) Long characterId) {
        if (characterId != null) {
            return quoteService.getQuotesByCharacterId(characterId);
        }
        return quoteService.getAllQuotes();
    }
    
    @GetMapping("/{id}")
    public Quote getQuoteById(@PathVariable Long id) {
        // INTENTIONAL BUG: Returns null if not found (no ResponseEntity wrapper)
        return quoteService.getQuoteById(id);
    }
    
    @PostMapping
    public Quote createQuote(@RequestBody Quote quote) {
        // INTENTIONAL BUG: Returns 200 instead of 201
        return quoteService.createQuote(quote);
    }
    
    @PostMapping("/{id}/like")
    public Quote likeQuote(@PathVariable Long id) {
        // INTENTIONAL BUG: No error handling, will throw exception if quote doesn't exist
        return quoteService.likeQuote(id);
    }
    
    @DeleteMapping("/{id}")
    public void deleteQuote(@PathVariable Long id) {
        quoteService.deleteQuote(id);
    }
}
