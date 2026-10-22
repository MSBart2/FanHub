package com.fanhub.interceptor;

import com.fanhub.model.Show;
import com.fanhub.repository.ShowRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Comparator;
import java.util.List;

@Component
public class UniverseContextInterceptor implements HandlerInterceptor {

    private final ShowRepository showRepository;

    public UniverseContextInterceptor(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        List<Show> shows = showRepository.findAll();
        if (shows.isEmpty()) {
            return true;
        }

        String showSlug = request.getHeader("X-Show-Slug");
        Show show = resolveShow(showSlug, shows);

        if (show == null) {
            show = shows.stream()
                    .min(Comparator.comparing(Show::getId))
                    .orElse(null);
        }

        if (show != null) {
            request.setAttribute("universe", show);
        }

        return true;
    }

    private Show resolveShow(String showSlug, List<Show> shows) {
        if (showSlug == null || showSlug.isBlank()) {
            return null;
        }

        try {
            Long showId = Long.valueOf(showSlug);
            return showRepository.findById(showId).orElse(null);
        } catch (NumberFormatException ignored) {
            String normalizedSlug = normalize(showSlug);
            return shows.stream()
                    .filter(show -> normalize(show.getTitle()).equals(normalizedSlug))
                    .findFirst()
                    .orElse(null);
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase().replace(" ", "-");
    }
}
