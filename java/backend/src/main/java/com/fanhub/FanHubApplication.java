package com.fanhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching  // Enabling cache for intentional cache bug
public class FanHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(FanHubApplication.class, args);
    }
}
