# Online Bookstore — Frontend (React + Vite)

## Run it

```bash
cd Frontend
npm install
npm run dev
```

Opens on **http://localhost:5173**. Make sure the backend is running on port 8080 first (see `Backend/README.md`) — `.env` already points to it:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## What's inside

```
src/
├── api/          One file per resource (authApi, bookApi, cartApi, wishlistApi,
│                  orderApi, profileApi, adminApi) — all requests go through
│                  axiosInstance.js, which attaches the auth token automatically.
├── context/       AuthContext (login/register/logout + session state),
│                  CartContext, WishlistContext — global state via React Context.
├── components/    Navbar, Footer, BookCard, ProtectedRoute, StarRating, LoadingSpinner
├── pages/         One component per route (Home, Login, Register, BookListing,
│                  BookDetails, Cart, Wishlist, Checkout, OrderHistory, Profile,
│                  AdminDashboard, NotFound)
├── App.jsx        Route table
└── main.jsx       Provider tree + router setup
```

## Auth & protected routes

- `AuthContext` stores the token/user in `localStorage` and verifies it against
  `GET /api/auth/me` on load, so a stale token doesn't leave a page looking
  "logged in" when it isn't.
- `ProtectedRoute` redirects to `/login` if there's no authenticated user (and to
  `/` if a non-admin hits `/admin`). It remembers where you were headed so login
  sends you back.
- Logging out calls the backend to revoke the token, then clears local storage
  and React state — so protected pages immediately require login again.

## Login for testing

A seeded admin account is available out of the box:

- **Email:** `admin@bookstore.com`
- **Password:** `Admin@123`

Or just register a new account from the UI — it becomes a regular `USER`.

## Design

The visual system ("Reading Room" palette — deep ink navy, warm parchment,
forest green, antique gold) lives in `src/index.css` as CSS variables, plus a
small per-component stylesheet next to each component that needs one
(e.g. `Navbar.css`, `BookCard.css`).

## Build for production

```bash
npm run build
```

Outputs a static bundle to `dist/`, ready to serve from any static host (or from Spring Boot's `static` resources if you want a single deployable artifact).
