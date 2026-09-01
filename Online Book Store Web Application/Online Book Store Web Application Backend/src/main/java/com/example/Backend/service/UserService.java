package com.example.Backend.service;

import com.example.Backend.dto.ProfileUpdateRequest;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.User;
import com.example.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User updateProfile(Long id, ProfileUpdateRequest request) {
        User user = getById(id);
        user.setName(request.getName());
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
