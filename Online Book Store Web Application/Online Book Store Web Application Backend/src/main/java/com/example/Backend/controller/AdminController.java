package com.example.Backend.controller;

import com.example.Backend.dto.BookRequest;
import com.example.Backend.dto.OrderStatusUpdateRequest;
import com.example.Backend.dto.UserResponse;
import com.example.Backend.model.Book;
import com.example.Backend.model.Order;
import com.example.Backend.service.BookService;
import com.example.Backend.service.OrderService;
import com.example.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookService bookService;
    private final OrderService orderService;
    private final UserService userService;

    public AdminController(BookService bookService, OrderService orderService, UserService userService) {
        this.bookService = bookService;
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.create(request));
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.update(id, request));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                     @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList()));
    }
}
