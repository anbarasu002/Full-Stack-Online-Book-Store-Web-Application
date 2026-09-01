package com.example.Backend.model;

public class WishlistItem {

    private Long bookId;

    public WishlistItem() {
    }

    public WishlistItem(Long bookId) {
        this.bookId = bookId;
    }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
}
