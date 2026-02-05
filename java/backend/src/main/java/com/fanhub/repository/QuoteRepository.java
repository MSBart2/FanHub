package com.fanhub.repository;

import com.fanhub.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    
    List<Quote> findByCharacterId(Long characterId);
    
    List<Quote> findByShowId(Long showId);
}
