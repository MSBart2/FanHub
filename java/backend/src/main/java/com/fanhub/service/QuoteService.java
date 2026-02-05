package com.fanhub.service;

import com.fanhub.model.Quote;
import com.fanhub.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuoteService {
    
    // INTENTIONAL BUG: Field injection (inconsistent)
    @Autowired
    private QuoteRepository quoteRepository;
    
    public List<Quote> getAllQuotes() {
        return quoteRepository.findAll();
    }
    
    public Quote getQuoteById(Long id) {
        return quoteRepository.findById(id).orElse(null);
    }
    
    public List<Quote> getQuotesByCharacterId(Long characterId) {
        return quoteRepository.findByCharacterId(characterId);
    }
    
    public Quote createQuote(Quote quote) {
        return quoteRepository.save(quote);
    }
    
    public Quote likeQuote(Long id) {
        Quote quote = quoteRepository.findById(id).get();
        // INTENTIONAL BUG: No null check, will throw exception if quote doesn't exist
        quote.setLikesCount(quote.getLikesCount() + 1);
        return quoteRepository.save(quote);
    }
    
    public void deleteQuote(Long id) {
        quoteRepository.deleteById(id);
    }
}
