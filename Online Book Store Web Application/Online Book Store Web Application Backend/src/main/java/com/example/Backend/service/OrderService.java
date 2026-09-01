package com.example.Backend.service;

import com.example.Backend.exception.BadRequestException;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.*;
import com.example.Backend.repository.BookRepository;
import com.example.Backend.repository.CartRepository;
import com.example.Backend.repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;


    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            BookRepository bookRepository
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }


    public Order placeOrder(
            Long userId,
            String name,
            String email,
            String phone,
            String shippingAddress,
            String country,
            String paymentMethod
    ) {

        List<CartItem> cartItems =
                cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }


        List<OrderItem> orderItems = cartItems.stream()
                .map(ci -> {

                    Book book = bookRepository.findById(ci.getBookId())
                            .orElseThrow(() ->
                                    new BadRequestException(
                                            "A book in your cart no longer exists"
                                    )
                            );


                    if (book.getStock() < ci.getQuantity()) {
                        throw new BadRequestException(
                                "Not enough stock for \"" +
                                book.getTitle() +
                                "\""
                        );
                    }


                    book.setStock(
                            book.getStock() - ci.getQuantity()
                    );

                    bookRepository.save(book);


                    return new OrderItem(
                            book.getId(),
                            book.getTitle(),
                            book.getPrice(),
                            ci.getQuantity()
                    );
                })
                .collect(Collectors.toList());


        double total = orderItems.stream()
                .mapToDouble(i ->
                        i.getPrice() * i.getQuantity()
                )
                .sum();


        Order order = new Order(
                null,
                userId,
                name,
                email,
                phone,
                orderItems,
                total,
                OrderStatus.PLACED,
                shippingAddress,
                country,
                paymentMethod,
                LocalDateTime.now()
        );


        orderRepository.save(order);

        cartRepository.clearByUserId(userId);

        return order;
    }


    public List<Order> getOrdersForUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }


    public Order getOrderForUser(Long userId, Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );


        if (!order.getUserId().equals(userId)) {
            throw new ResourceNotFoundException(
                    "Order not found"
            );
        }


        return order;
    }


    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }


    public Order updateStatus(
            Long orderId,
            OrderStatus status
    ) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        order.setStatus(status);

        return orderRepository.save(order);
    }
}