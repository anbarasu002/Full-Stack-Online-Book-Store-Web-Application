package com.example.Backend.repository;

import com.example.Backend.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class UserRepository {

    private final Map<Long, User> usersById = new ConcurrentHashMap<>();
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idGenerator.incrementAndGet());
        }
        usersById.put(user.getId(), user);
        usersByEmail.put(normalize(user.getEmail()), user);
        return user;
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(usersById.get(id));
    }

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(normalize(email)));
    }

    public boolean existsByEmail(String email) {
        return usersByEmail.containsKey(normalize(email));
    }

    public List<User> findAll() {
        return List.copyOf(usersById.values());
    }

    private String normalize(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
