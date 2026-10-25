package com.spit.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configures password encoding for the SPIT application.
 *
 * Uses BCrypt to hash passwords before they are stored.
 */
@Configuration
public class PasswordConfig {

    /**
     * Creates the password encoder used by Spring Security.
     *
     * @return a BCrypt password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
