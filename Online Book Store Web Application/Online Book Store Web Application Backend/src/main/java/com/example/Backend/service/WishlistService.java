package com.example.Backend.service;

import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.Book;
import com.example.Backend.model.WishlistItem;
import com.example.Backend.repository.BookRepository;
import com.example.Backend.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;

    public WishlistService(WishlistRepository wishlistRepository, BookRepository bookRepository) {
        this.wishlistRepository = wishlistRepository;
        this.bookRepository = bookRepository;
    }

    public List<Book> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(item -> bookRepository.findById(item.getBookId()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<Book> addItem(Long userId, Long bookId) {
        bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        List<WishlistItem> items = wishlistRepository.findByUserId(userId);
        boolean exists = items.stream().anyMatch(i -> i.getBookId().equals(bookId));
        if (!exists) {
            items.add(new WishlistItem(bookId));
            wishlistRepository.saveAll(userId, items);
        }
        return getWishlist(userId);
    }

    public List<Book> removeItem(Long userId, Long bookId) {
        List<WishlistItem> items = wishlistRepository.findByUserId(userId);
        items.removeIf(i -> i.getBookId().equals(bookId));
        wishlistRepository.saveAll(userId, items);
        return getWishlist(userId);
    }
}
