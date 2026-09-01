package com.example.Backend.controller;

import com.example.Backend.model.Book;
import com.example.Backend.model.User;
import com.example.Backend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId(authentication)));
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<List<Book>> addItem(Authentication authentication, @PathVariable Long bookId) {
        return ResponseEntity.ok(wishlistService.addItem(userId(authentication), bookId));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<List<Book>> removeItem(Authentication authentication, @PathVariable Long bookId) {
        return ResponseEntity.ok(wishlistService.removeItem(userId(authentication), bookId));
    }

    private Long userId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }
}
