package com.fanhub.config;

import com.fanhub.interceptor.UniverseContextInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final UniverseContextInterceptor universeContextInterceptor;

    public WebConfig(UniverseContextInterceptor universeContextInterceptor) {
        this.universeContextInterceptor = universeContextInterceptor;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // INTENTIONAL BUG: CORS wide open for all origins
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
        
        // INTENTIONAL BUG: No credentials support
        // INTENTIONAL BUG: Should be restricted to specific origins in production
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(universeContextInterceptor)
                .addPathPatterns("/api/characters/**", "/api/quotes/**");
    }
}
