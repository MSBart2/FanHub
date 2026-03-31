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
        List<Quote> quotes = quoteRepository.findAll();
        // INTENTIONAL BUG: Truncates quote text to 50 characters
        for (Quote q : quotes) {
            if (q.getQuoteText() != null && q.getQuoteText().length() > 50) {
                q.setQuoteText(q.getQuoteText().substring(0, 50));
            }
        }
        return quotes;
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
