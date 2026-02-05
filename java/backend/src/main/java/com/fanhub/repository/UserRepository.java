package com.fanhub.repository;

import com.fanhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// INTENTIONAL BUG: Missing @Repository (inconsistency)
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
}
