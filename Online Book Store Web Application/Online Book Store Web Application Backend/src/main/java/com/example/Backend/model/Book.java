package com.example.Backend.model;

import java.util.List;

public class Book {

    private Long id;
    private String title;
    private String author;
    private String description;
    private String category;
    private double price;
    private double rating;
    private int stock;
    private String coverImage;
    private String isbn;
    private List<String> tags;

    public Book() {
    }

    public Book(Long id, String title, String author, String description, String category,
                double price, double rating, int stock, String coverImage, String isbn, List<String> tags) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.category = category;
        this.price = price;
        this.rating = rating;
        this.stock = stock;
        this.coverImage = coverImage;
        this.isbn = isbn;
        this.tags = tags;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
