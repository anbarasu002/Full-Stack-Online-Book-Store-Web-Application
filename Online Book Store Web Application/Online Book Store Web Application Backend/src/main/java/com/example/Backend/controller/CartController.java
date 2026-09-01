package com.example.Backend.controller;

import com.example.Backend.dto.CartItemRequest;
import com.example.Backend.model.User;
import com.example.Backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(userId(authentication)));
    }

    @PostMapping
    public ResponseEntity<List<Map<String, Object>>> addItem(Authentication authentication,
                                                               @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(userId(authentication), request.getBookId(), request.getQuantity()));
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<List<Map<String, Object>>> updateItem(Authentication authentication,
                                                                  @PathVariable Long bookId,
                                                                  @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateItem(userId(authentication), bookId, quantity));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<List<Map<String, Object>>> removeItem(Authentication authentication, @PathVariable Long bookId) {
        return ResponseEntity.ok(cartService.removeItem(userId(authentication), bookId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(userId(authentication));
        return ResponseEntity.noContent().build();
    }

    private Long userId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }
}
