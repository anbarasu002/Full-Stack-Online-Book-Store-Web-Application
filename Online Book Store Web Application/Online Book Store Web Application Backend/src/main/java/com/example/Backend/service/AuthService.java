package com.example.Backend.service;

import com.example.Backend.dto.*;
import com.example.Backend.exception.DuplicateEmailException;
import com.example.Backend.exception.InvalidCredentialsException;
import com.example.Backend.model.Role;
import com.example.Backend.model.User;
import com.example.Backend.repository.UserRepository;
import com.example.Backend.security.TokenStore;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenStore tokenStore;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenStore tokenStore) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenStore = tokenStore;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("An account with this email already exists");
        }

        User user = new User(
                null,
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                Role.USER
        );
        userRepository.save(user);

        String token = tokenStore.issueToken(user.getId());
        return new AuthResponse(token, UserResponse.fromUser(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = tokenStore.issueToken(user.getId());
        return new AuthResponse(token, UserResponse.fromUser(user));
    }

    public void logout(String token) {
        tokenStore.revoke(token);
    }
}
