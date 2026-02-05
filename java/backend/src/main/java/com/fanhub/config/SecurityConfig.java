package com.fanhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // INTENTIONAL BUG: CSRF disabled
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // INTENTIONAL BUG: All endpoints are public
            );
        
        // INTENTIONAL BUG: No JWT filter configured
        // INTENTIONAL BUG: No authentication provider configured
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // INTENTIONAL BUG: Default strength (10 rounds) - should be configurable
        return new BCryptPasswordEncoder();
    }
}
