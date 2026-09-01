package com.example.Backend.service;

import com.example.Backend.dto.BookRequest;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.Book;
import com.example.Backend.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> search(String query, String category, Double minPrice, Double maxPrice,
                              Double minRating, String sortBy) {
        List<Book> results = bookRepository.findAll();

        if (query != null && !query.isBlank()) {
            String q = query.trim().toLowerCase();
            results = results.stream()
                    .filter(b -> b.getTitle().toLowerCase().contains(q)
                            || b.getAuthor().toLowerCase().contains(q)
                            || (b.getDescription() != null && b.getDescription().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            results = results.stream()
                    .filter(b -> b.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            results = results.stream().filter(b -> b.getPrice() >= minPrice).collect(Collectors.toList());
        }
        if (maxPrice != null) {
            results = results.stream().filter(b -> b.getPrice() <= maxPrice).collect(Collectors.toList());
        }
        if (minRating != null) {
            results = results.stream().filter(b -> b.getRating() >= minRating).collect(Collectors.toList());
        }

        if (sortBy != null) {
            Comparator<Book> comparator = switch (sortBy) {
                case "price_asc" -> Comparator.comparingDouble(Book::getPrice);
                case "price_desc" -> Comparator.comparingDouble(Book::getPrice).reversed();
                case "rating_desc" -> Comparator.comparingDouble(Book::getRating).reversed();
                case "title_asc" -> Comparator.comparing(Book::getTitle, String.CASE_INSENSITIVE_ORDER);
                default -> null;
            };
            if (comparator != null) {
                results = results.stream().sorted(comparator).collect(Collectors.toList());
            }
        }

        return results;
    }

    public Book getById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
    }

    public List<String> getCategories() {
        return bookRepository.findAll().stream()
                .map(Book::getCategory)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Book create(BookRequest request) {
        Book book = new Book(null, request.getTitle(), request.getAuthor(), request.getDescription(),
                request.getCategory(), request.getPrice(), 0.0, request.getStock(),
                request.getCoverImage(), request.getIsbn(), request.getTags());
        return bookRepository.save(book);
    }

    public Book update(Long id, BookRequest request) {
        Book existing = getById(id);
        existing.setTitle(request.getTitle());
        existing.setAuthor(request.getAuthor());
        existing.setDescription(request.getDescription());
        existing.setCategory(request.getCategory());
        existing.setPrice(request.getPrice());
        existing.setStock(request.getStock());
        existing.setCoverImage(request.getCoverImage());
        existing.setIsbn(request.getIsbn());
        existing.setTags(request.getTags());
        return bookRepository.save(existing);
    }

    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id " + id);
        }
        bookRepository.deleteById(id);
    }
}
