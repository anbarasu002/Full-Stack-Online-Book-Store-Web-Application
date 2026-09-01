package com.example.Backend.repository;

import com.example.Backend.model.Order;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class OrderRepository {

    private final Map<Long, Order> orders = new ConcurrentHashMap<>();

    private final AtomicLong idGenerator = new AtomicLong(0);

    public Order save(Order order) {

        if (order.getId() == null) {
            order.setId(idGenerator.incrementAndGet());
        }

        orders.put(order.getId(), order);

        return order;
    }

    public Optional<Order> findById(Long id) {

        return Optional.ofNullable(
                orders.get(id)
        );
    }

    public List<Order> findAll() {

        return List.copyOf(
                orders.values()
        );
    }

    public List<Order> findByUserId(Long userId) {

        return orders.values()
                .stream()
                .filter(order ->
                        order.getUserId() != null
                                && order.getUserId().equals(userId)
                )
                .collect(Collectors.toList());
    }
}