package com.fanhub.service;

import com.fanhub.model.Quote;
import com.fanhub.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

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

    public Quote getSpotlightQuote(Long showId) {
        List<Quote> quotes = quoteRepository.findByShowId(showId);
        if (quotes.isEmpty()) {
            return null;
        }

        List<Quote> famousQuotes = quotes.stream()
                .filter(quote -> Boolean.TRUE.equals(quote.getIsFamous()))
                .collect(Collectors.toList());

        List<Quote> spotlightPool = famousQuotes.isEmpty() ? quotes : famousQuotes;
        int selectedIndex = ThreadLocalRandom.current().nextInt(spotlightPool.size());
        return spotlightPool.get(selectedIndex);
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
