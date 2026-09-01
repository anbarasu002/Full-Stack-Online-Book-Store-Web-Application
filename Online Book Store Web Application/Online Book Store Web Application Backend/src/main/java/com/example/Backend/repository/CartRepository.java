package com.example.Backend.repository;

import com.example.Backend.model.CartItem;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class CartRepository {

    private final Map<Long, List<CartItem>> cartsByUser = new ConcurrentHashMap<>();

    public List<CartItem> findByUserId(Long userId) {
        return cartsByUser.computeIfAbsent(userId, id -> new CopyOnWriteArrayList<>());
    }

    public void clearByUserId(Long userId) {
        cartsByUser.remove(userId);
    }

    public void saveAll(Long userId, List<CartItem> items) {
        cartsByUser.put(userId, new CopyOnWriteArrayList<>(items));
    }
}
