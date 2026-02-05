package com.fanhub.service;

import com.fanhub.model.Show;
import com.fanhub.repository.ShowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {
    
    private final ShowRepository showRepository;
    
    public ShowService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }
    
    public List<Show> getAllShows() {
        return showRepository.findAll();
    }
    
    public Show getShowById(Long id) {
        // INTENTIONAL BUG: Using orElse(null) - inconsistent error handling
        return showRepository.findById(id).orElse(null);
    }
    
    public Show createShow(Show show) {
        // INTENTIONAL BUG: No validation that title is not empty
        return showRepository.save(show);
    }
    
    public Show updateShow(Long id, Show show) {
        show.setId(id);
        return showRepository.save(show);
    }
    
    public void deleteShow(Long id) {
        showRepository.deleteById(id);
    }
}
