package com.fanhub.controller;

import com.fanhub.model.User;
import com.fanhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

// INTENTIONAL BUG: Using /auth instead of /api/auth (inconsistent with other endpoints)
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    // INTENTIONAL BUG: Creating BCryptPasswordEncoder in controller instead of as a bean
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String username = request.get("username");
        
        // INTENTIONAL BUG: Weak password validation
        if (password == null || password.length() < 6) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Password must be at least 6 characters");
            return ResponseEntity.status(400).body(error);
        }
        
        // INTENTIONAL BUG: No email format validation
        // INTENTIONAL BUG: No check if user already exists
        
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole("user");
        user.setIsActive(true);
        
        User saved = userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", saved.getId());
        
        return ResponseEntity.status(201).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        // INTENTIONAL BUG: No input validation
        
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            // INTENTIONAL BUG: Exposing whether user exists (security issue)
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
        }
        
        // INTENTIONAL BUG: No JWT token generation (incomplete implementation)
        // TODO: Generate JWT token
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("user", Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "username", user.getUsername()
        ));
        // INTENTIONAL BUG: No token returned
        response.put("token", "not_implemented");
        
        return ResponseEntity.ok(response);
    }
    
    // INTENTIONAL BUG: Missing logout endpoint
    // INTENTIONAL BUG: Missing token refresh endpoint
    // INTENTIONAL BUG: Missing forgot password endpoint
}
