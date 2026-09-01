package com.example.Backend.repository;

import com.example.Backend.model.WishlistItem;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class WishlistRepository {

    private final Map<Long, List<WishlistItem>> wishlistsByUser = new ConcurrentHashMap<>();

    public List<WishlistItem> findByUserId(Long userId) {
        return wishlistsByUser.computeIfAbsent(userId, id -> new CopyOnWriteArrayList<>());
    }

    public void saveAll(Long userId, List<WishlistItem> items) {
        wishlistsByUser.put(userId, new CopyOnWriteArrayList<>(items));
    }
}
