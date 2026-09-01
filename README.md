# 📚 Book World – Full Stack Online Book Store Web Application

A full-stack e-commerce web application for browsing, searching, and purchasing books online. Built with a **React (Vite)** frontend and a **Spring Boot REST API** backend, featuring token-based authentication, a shopping cart, wishlist, order management, and a dedicated admin dashboard.

**🔗 Live Demo:** [🚀 Live Demo ](https://full-stack-online-book-store-web-ap.vercel.app/)

---

## 📖 Project Overview

Book World is a complete online bookstore platform where users can create an account, browse a catalog of books, search and filter by category/price/rating, maintain a wishlist, manage a shopping cart, place orders, and track their order history. Administrators get a separate dashboard to manage the book catalog, view and update order statuses, and view registered users.

The backend is a Spring Boot REST API secured with a custom bearer-token authentication layer, and the frontend is a single-page application built with React and Vite that consumes this API.

> **Note on data persistence:** The backend currently stores all data (users, books, carts, wishlists, orders) in memory using `ConcurrentHashMap`-based repositories. Data resets whenever the backend restarts. The repository layer is cleanly isolated, so it can be swapped for a real database (e.g. via Spring Data JPA) without changing the service, controller, or DTO layers.

---

## ✨ Features

- User registration and login with secure password hashing
- Token-based session authentication with logout/token revocation
- Book catalog with search, category filter, price range, rating filter, and sorting
- Book detail pages with star ratings
- Shopping cart (add, update quantity, remove, clear)
- Wishlist (add/remove books)
- Checkout flow that converts the cart into an order
- Order history for logged-in users
- User profile view and update
- Admin dashboard for managing books, orders, and users
- Route protection on the frontend (auth-only and admin-only routes)
- Centralized error handling with consistent JSON error responses

---

## 🛠️ Technologies Used

### Frontend
- **React 18** – UI library
- **Vite** – build tool and dev server
- **React Router DOM** – client-side routing
- **Axios** – HTTP client for API requests
- **React Context API** – global state (auth, cart, wishlist)
- **CSS3** (custom, component-scoped stylesheets) – styling
- **Boxicons** & **Google Fonts** – icons and typography

### Backend
- **Java 17**
- **Spring Boot 3.3**
- **Spring Web** – REST API layer
- **Spring Security** – authentication/authorization filter chain
- **Spring Validation** – request payload validation
- **Lombok** – boilerplate reduction
- **BCrypt** – password hashing
- **Maven** – build and dependency management

---

## 🎨 Frontend

The frontend is a React + Vite single-page application organized as follows:

- **`api/`** – One module per resource (`authApi`, `bookApi`, `cartApi`, `wishlistApi`, `orderApi`, `profileApi`, `adminApi`), all routed through a shared `axiosInstance` that automatically attaches the auth token to every request.
- **`context/`** – Global state management via `AuthContext`, `CartContext`, and `WishlistContext`.
- **`components/`** – Reusable UI pieces: `Navbar`, `Footer`, `BookCard`, `StarRating`, `ProtectedRoute`, `LoadingSpinner`.
- **`pages/`** – One component per route: `Home`, `Auth` (login/register), `BookListing`, `BookDetails`, `Cart`, `Wishlist`, `Checkout`, `OrderHistory`, `Profile`, `AdminDashboard`, `NotFound`.

`ProtectedRoute` guards authenticated pages (redirecting to `/login` if unauthenticated) and admin-only pages (redirecting non-admins away from `/admin`), while preserving the intended destination for a smooth post-login redirect.

---

## ⚙️ Backend

The backend is a Spring Boot REST API organized in a standard layered architecture:

```
com.example.Backend
├── config       SecurityConfig (CORS + route rules), DataInitializer (seed data)
├── controller   REST endpoints
├── dto          Request/response payloads with validation annotations
├── exception    Custom exceptions + GlobalExceptionHandler
├── model        Domain objects (User, Book, Order, CartItem, WishlistItem, ...)
├── repository   In-memory ConcurrentHashMap-backed data stores
├── security     TokenStore (opaque session tokens), AuthTokenFilter
└── service      Business logic
```

On startup, `DataInitializer` seeds a default **admin account** and a **starter catalog of books** so the application is usable immediately without any manual setup.

---

## 🏗️ Application Architecture

```
┌─────────────────────────┐        HTTPS / JSON        ┌──────────────────────────┐
│   React (Vite) Frontend │  ─────────────────────────▶ │   Spring Boot REST API   │
│  - Pages & Components   │ ◀───────────────────────── │  - Controllers           │
│  - Context (Auth/Cart)  │       Bearer Token          │  - Services              │
│  - Axios API layer      │                              │  - Security Filter Chain│
└─────────────────────────┘                              │  - In-Memory Repositories│
                                                            └──────────────────────────┘
```

- The frontend and backend are fully decoupled, communicating exclusively through a REST API.
- Authentication is stateless from Spring Security's perspective (`SessionCreationPolicy.STATELESS`), relying on a bearer token validated on every request.
- CORS is configured on the backend to explicitly allow the frontend's origin.

---

## 📁 Project Structure

```
Full-Stack-Online-Book-Store-Web-Application/
│
├── Online Book Store Web Application Backend/
│   ├── src/main/java/com/example/Backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
└── Online Book Store Web Application Frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 👤 User Features

- Register a new account or log in with an existing one
- Browse the full book catalog
- Search books and filter by category, price range, and minimum rating
- Sort book listings
- View detailed information for a specific book
- Add/remove books to/from a wishlist
- Add books to a cart, update quantities, remove items, or clear the cart
- Checkout and place an order from the current cart
- View personal order history
- View and update profile information
- Log out (immediately revokes the session token)

---

## 🛡️ Admin Features

Users with the `ADMIN` role get access to a dedicated **Admin Dashboard** (`/admin`) with three sections:

- **Manage Books** – create, update, and delete books in the catalog
- **Manage Orders** – view all orders placed across the platform and update their status (`PLACED → PROCESSING → SHIPPED → DELIVERED`, or `CANCELLED`)
- **Users** – view all registered users

Admin-only API routes are protected by both the frontend's `ProtectedRoute` (with an `adminOnly` flag) and the backend's Spring Security rule requiring the `ADMIN` role.

---

## 🔐 Authentication

Authentication is implemented as a custom, in-memory **bearer-token** scheme (not JWT):

1. `POST /api/auth/register` or `POST /api/auth/login` returns an opaque token plus the user's profile.
2. The frontend stores this token and sends it as `Authorization: Bearer <token>` on every subsequent request via the Axios interceptor.
3. `TokenStore` (server-side, in-memory) maps each token to a user ID, with a sliding expiry (default: **180 minutes**, configurable).
4. `AuthTokenFilter` reads the header on each request and populates Spring Security's context, so controllers can simply take an `Authentication` parameter.
5. `POST /api/auth/logout` immediately revokes the token — it's removed from the store and the frontend clears its local copy — so a logged-out session cannot access protected routes again.
6. Passwords are hashed with **BCrypt** and are never stored or returned in plain text.

**Seeded admin credentials** (for local testing — change before any real deployment):

| Field | Value |
|---|---|
| Email | `admin@bookstore.com` |
| Password | `Admin@123` |

Regular users can simply register through the UI, which creates a `USER`-role account.

---

## 🔗 REST API Integration

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account, returns token |
| POST | `/api/auth/login` | Public | Authenticate, returns token |
| POST | `/api/auth/logout` | Bearer | Revoke the current token |
| GET | `/api/auth/me` | Bearer | Get current user profile |
| GET | `/api/books` | Public | List/search/filter books (`query`, `category`, `minPrice`, `maxPrice`, `minRating`, `sortBy`) |
| GET | `/api/books/categories` | Public | Get distinct category list |
| GET | `/api/books/{id}` | Public | Get book detail |
| GET/POST/PUT/DELETE | `/api/cart` | Bearer | View / add / update / clear cart |
| GET/POST/DELETE | `/api/wishlist` | Bearer | View / add / remove wishlist items |
| POST | `/api/orders` | Bearer | Place an order from the current cart |
| GET | `/api/orders` | Bearer | Get current user's order history |
| GET/PUT | `/api/profile` | Bearer | View / update profile |
| POST/PUT/DELETE | `/api/admin/books` | Bearer + ADMIN | Manage the book catalog |
| GET/PATCH | `/api/admin/orders` | Bearer + ADMIN | View all orders / update order status |
| GET | `/api/admin/users` | Bearer + ADMIN | List all registered users |

Validation errors return `400` with a field → message map. Business errors (duplicate email, invalid credentials, not found, unauthorized, etc.) return the appropriate HTTP status with a `message` field, handled centrally by `GlobalExceptionHandler`.

The frontend communicates with these endpoints through a shared Axios instance (`src/api/axiosInstance.js`) that automatically injects the bearer token and clears the session on a `401` response.

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18+ recommended) and **npm**
- **Java 17**
- **Maven** (or use the included Maven Wrapper, if present)

### Clone the repository
```bash
git clone https://github.com/anbarasu002/Full-Stack-Online-Book-Store-Web-Application.git
cd Full-Stack-Online-Book-Store-Web-Application
```

---

## 🖥️ Frontend Setup

```bash
cd "Online Book Store Web Application Frontend"
npm install
npm run dev
```

The app runs on **http://localhost:5173**.

To build a production bundle:
```bash
npm run build
```
This outputs a static bundle to `dist/`, which can be served from any static host.

---

## ⚙️ Backend Setup

```bash
cd "Online Book Store Web Application Backend"
mvn spring-boot:run
```

The API runs on **http://localhost:8080**.

On first run, a default admin account and a starter catalog of books are seeded automatically — no database setup required.

---

## 🔧 Environment Variables

### Frontend (`.env`)

The frontend reads the backend's base URL from a single environment variable:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

To point the frontend at a deployed backend, update this value to your backend's public URL (e.g. `https://your-backend-host.com/api`) and rebuild/redeploy the frontend.

### Backend (`application.properties`)

```properties
spring.application.name=Backend
server.port=8080

# CORS - allowed frontend origin(s)
app.cors.allowed-origins=http://localhost:5173

# In-memory auth token expiry (minutes)
app.auth.token-expiry-minutes=180

# Default admin seeded at startup
app.admin.email=admin@bookstore.com
app.admin.password=Admin@123
app.admin.name=Store Admin
```

For a production deployment, update `app.cors.allowed-origins` to your deployed frontend's URL, and change the default admin credentials.

---

## ▶️ Running the Application

1. Start the backend first: `mvn spring-boot:run` (from the backend folder) → runs on `http://localhost:8080`
2. Start the frontend: `npm run dev` (from the frontend folder) → runs on `http://localhost:5173`
3. Open **http://localhost:5173** in your browser
4. Log in with the seeded admin account, or register a new user account

---

## ☁️ Deployment

- **Frontend:** Deployed on **Vercel**
- **Backend:** Deployed on **Render**

Configure `VITE_API_BASE_URL` in the frontend's environment settings (on Vercel) to point to the deployed backend's Render URL, and update `app.cors.allowed-origins` on the backend to match the deployed frontend's Vercel origin.

> Since the backend currently uses in-memory storage, all data will reset on every backend restart/redeploy. Keep this in mind on Render's free tier, where the service can spin down after inactivity and lose all seeded/added data on the next restart.

---

## 📸 Screenshots

<!-- Add screenshots of your application below -->

| Home Page | Book Listing |
|---|---|
| _screenshot placeholder_ | _screenshot placeholder_ |

| Book Details | Cart |
|---|---|
| _screenshot placeholder_ | _screenshot placeholder_ |

| Checkout | Order History |
|---|---|
| _screenshot placeholder_ | _screenshot placeholder_ |

| Admin Dashboard – Books | Admin Dashboard – Orders |
|---|---|
| _screenshot placeholder_ | _screenshot placeholder_ |

---

## 🔮 Future Enhancements

- Replace in-memory repositories with a persistent database (e.g. PostgreSQL/MySQL via Spring Data JPA)
- Migrate to JWT-based authentication with refresh tokens
- Add pagination on the backend for large catalogs and order lists
- Integrate a real payment gateway at checkout
- Add product reviews and user-submitted ratings
- Add email notifications for order status updates
- Add automated tests (unit and integration) for backend services and frontend components
- Containerize the application with Docker for easier deployment

---

## 🎓 Learning Outcomes

Building this project involved:

- Designing and implementing a RESTful API with Spring Boot, including a custom token-based authentication and authorization filter chain
- Structuring a Spring application using a clean, layered architecture (controller → service → repository)
- Building a role-based access control system (`USER` vs `ADMIN`) enforced at both the frontend and backend
- Building a React single-page application with protected routes, global state via Context API, and a centralized Axios API layer
- Implementing common e-commerce flows end-to-end: catalog browsing, search/filter, cart, wishlist, checkout, and order tracking
- Managing environment-based configuration for connecting a decoupled frontend and backend across local and deployed environments

---

## 👨‍💻 Author

**Anbarasu**
GitHub: [@anbarasu002](https://github.com/anbarasu002)

---

## 📄 License

This project is available for educational and portfolio purposes. If you'd like to reuse or build upon this code, please add a formal license (e.g. MIT) to the repository, or contact the author.
