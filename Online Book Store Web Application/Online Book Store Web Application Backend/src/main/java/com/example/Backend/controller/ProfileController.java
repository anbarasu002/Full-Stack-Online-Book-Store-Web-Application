package com.example.Backend.controller;

import com.example.Backend.dto.ProfileUpdateRequest;
import com.example.Backend.dto.UserResponse;
import com.example.Backend.model.User;
import com.example.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(UserResponse.fromUser(userService.getById(user.getId())));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(Authentication authentication,
                                                        @Valid @RequestBody ProfileUpdateRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(UserResponse.fromUser(userService.updateProfile(user.getId(), request)));
    }
}
