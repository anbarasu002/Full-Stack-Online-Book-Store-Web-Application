package com.example.Backend.service;

import com.example.Backend.exception.BadRequestException;
import com.example.Backend.model.Book;
import com.example.Backend.model.CartItem;
import com.example.Backend.repository.BookRepository;
import com.example.Backend.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    public CartService(CartRepository cartRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }

    public List<Map<String, Object>> getCart(Long userId) {
        return enrich(cartRepository.findByUserId(userId));
    }

    public List<Map<String, Object>> addItem(Long userId, Long bookId, int quantity) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BadRequestException("Book not found"));
        if (book.getStock() < quantity) {
            throw new BadRequestException("Not enough stock available for \"" + book.getTitle() + "\"");
        }

        List<CartItem> items = cartRepository.findByUserId(userId);
        boolean found = false;
        for (CartItem item : items) {
            if (item.getBookId().equals(bookId)) {
                item.setQuantity(item.getQuantity() + quantity);
                found = true;
                break;
            }
        }
        if (!found) {
            items.add(new CartItem(bookId, quantity));
        }
        cartRepository.saveAll(userId, items);
        return enrich(items);
    }

    public List<Map<String, Object>> updateItem(Long userId, Long bookId, int quantity) {
        if (quantity < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }
        List<CartItem> items = cartRepository.findByUserId(userId);
        items.stream()
                .filter(i -> i.getBookId().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Item not in cart"))
                .setQuantity(quantity);
        cartRepository.saveAll(userId, items);
        return enrich(items);
    }

    public List<Map<String, Object>> removeItem(Long userId, Long bookId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        items.removeIf(i -> i.getBookId().equals(bookId));
        cartRepository.saveAll(userId, items);
        return enrich(items);
    }

    public void clearCart(Long userId) {
        cartRepository.clearByUserId(userId);
    }

    private List<Map<String, Object>> enrich(List<CartItem> items) {
        return items.stream().map(item -> {
            Map<String, Object> row = new LinkedHashMap<>();
            Book book = bookRepository.findById(item.getBookId()).orElse(null);
            row.put("book", book);
            row.put("quantity", item.getQuantity());
            row.put("subtotal", book != null ? book.getPrice() * item.getQuantity() : 0);
            return row;
        }).collect(Collectors.toList());
    }
}
