package com.example.Backend.model;

public class OrderItem {

    private Long bookId;

    private String title;

    private double price;

    private int quantity;

    public OrderItem() {
    }

    public OrderItem(
            Long bookId,
            String title,
            double price,
            int quantity
    ) {
        this.bookId = bookId;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}