package com.example.Backend.controller;

import com.example.Backend.dto.OrderRequest;
import com.example.Backend.model.Order;
import com.example.Backend.model.User;
import com.example.Backend.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;


    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request
    ) {

        Long userId = userId(authentication);

        Order order = orderService.placeOrder(
                userId,
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getShippingAddress(),
                request.getCountry(),
                request.getPaymentMethod()
        );

        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                orderService.getOrdersForUser(
                        userId(authentication)
                )
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                orderService.getOrderForUser(
                        userId(authentication),
                        orderId
                )
        );
    }

    private Long userId(Authentication authentication) {

        return ((User) authentication.getPrincipal()).getId();
    }
}
