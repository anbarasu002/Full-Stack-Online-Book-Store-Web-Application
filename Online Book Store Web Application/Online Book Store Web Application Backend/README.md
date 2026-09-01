# Online Bookstore — Backend (Spring Boot, In-Memory)

No database. All data (users, books, carts, wishlists, orders) lives in
`ConcurrentHashMap`-based repositories and resets when the app restarts.

## Run it

```bash
cd Backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

A default admin account and a 12-book starter catalog are seeded automatically on startup:

- **Admin email:** `admin@bookstore.com`
- **Admin password:** `Admin@123`

(Change these in `src/main/resources/application.properties` before any real deployment.)

## How authentication works (no database, no JWT library)

- `POST /api/auth/register` / `POST /api/auth/login` return an opaque UUID **token** plus the user's profile.
- The frontend stores that token and sends it as `Authorization: Bearer <token>` on every request.
- `TokenStore` (in-memory) maps token → user id with a sliding expiry (default 180 minutes, configurable via `app.auth.token-expiry-minutes`).
- `AuthTokenFilter` reads the header on each request and populates Spring Security's context, so `@RestController` methods can just take an `Authentication` parameter.
- `POST /api/auth/logout` revokes the token immediately — it's removed from the store, so it can never be reused, and the frontend also clears its local copy. This is what guarantees a user can't hit protected pages after logging out.
- Passwords are hashed with BCrypt; they're never stored or returned in plain text.

## REST API summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account, returns token |
| POST | `/api/auth/login` | Public | Returns token |
| POST | `/api/auth/logout` | Bearer | Revokes the current token |
| GET | `/api/auth/me` | Bearer | Current user profile |
| GET | `/api/books` | Public | List/search/filter books (`query`, `category`, `minPrice`, `maxPrice`, `minRating`, `sortBy`) |
| GET | `/api/books/categories` | Public | Distinct category list |
| GET | `/api/books/{id}` | Public | Book detail |
| GET/POST/PUT/DELETE | `/api/cart` | Bearer | View/add/update/clear cart |
| GET/POST/DELETE | `/api/wishlist` | Bearer | View/add/remove wishlist items |
| POST | `/api/orders` | Bearer | Place an order from the current cart |
| GET | `/api/orders` | Bearer | Current user's order history |
| GET/PUT | `/api/profile` | Bearer | View/update profile |
| POST/PUT/DELETE | `/api/admin/books` | Bearer + ADMIN | Manage catalog |
| GET/PATCH | `/api/admin/orders` | Bearer + ADMIN | View all orders / update status |
| GET | `/api/admin/users` | Bearer + ADMIN | List all users |

Validation errors return `400` with a field → message map. Business errors (duplicate email, bad login, not found, etc.) return the matching status code with a `message` field — see `GlobalExceptionHandler`.

## Project layout

```
com.example.Backend
├── config       SecurityConfig (CORS + route rules), DataInitializer (seed data)
├── controller   REST endpoints
├── dto          Request/response payloads + validation annotations
├── exception    Custom exceptions + GlobalExceptionHandler
├── model        Plain domain objects (User, Book, Order, ...)
├── repository   In-memory ConcurrentHashMap-backed stores
├── security     TokenStore (opaque session tokens), AuthTokenFilter
└── service      Business logic
```

## Notes on scaling this later

Every repository class is a small, self-contained interface around a `Map`. If you ever do want to add a real database, you only need to swap the internals of the `repository` package for JPA repositories — the `service`, `controller`, and `dto` layers won't need to change.
