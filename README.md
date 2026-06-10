# PRETUTE Premium E-Commerce Storefront (React & Node.js SPA)

A modern, highly responsive e-commerce web application for **PRETUTE** (a premium baby, kids, and maternity lifestyle brand) migrated to a **React** frontend and a **Node.js Express** backend.

---

## 🌟 Key Features & Updates

1. **Vite React SPA**: Smooth single-page architecture with React state handling.
2. **Express REST API Backend**: Node.js backend handles data operations (Products, Bookings, and Messages).
3. **JSON File Database**: Stored locally in `server/data/db.json` for persistent storage without external database installation.
4. **Backend Dashboard**:
   - **Product Manager**: Full CRUD actions (Add, Edit, Delete, View) for the product catalog.
   - **Booking Control**: Manage, confirm, or cancel customer consultations.
   - **Inbox**: Read and clear incoming customer messages.
5. **Interactive Booking Form**: Scheduling tool on the Home page for custom nursery and play consults.
6. **Interactive Contact Form**: Custom inbox mailer form on the Home page.
7. **Coupon Rules Engine**: Apply discount codes like `PRETUTE20` (flat 20%), `GEAR25` (25% off gear), `PLAYFREE` (₹500 off toys), or `MOM15` (₹1000 off maternity with ₹4999 min spend).
8. **Product Detail Magnifier**: Coordinating lens hover zoom effect scaling details by 2.5x.
9. **State Persistence**: Cart items, wishlist items, and coupon states are synchronized with the browser's `localStorage`.

---

## 📂 Project Structure

```text
├── package.json               # Root package.json (concurrently orchestrator)
├── README.md                  # Project documentation
├── server/                    # Node.js Express server
│   ├── package.json           # Server package configs
│   ├── index.js               # Express app routes & database seeders
│   └── data/
│       └── db.json            # Local JSON database file
└── client/                    # Vite React client
    ├── package.json           # React dependencies
    ├── vite.config.js         # Port/Proxy setups for backend integration
    ├── index.html             # Google fonts & FontAwesome imports
    ├── public/
    │   └── assets/            # Storefront images and logos
    └── src/
        ├── main.jsx           # React app entry
        ├── App.jsx            # Router and base structure
        ├── index.css          # Storefront styles + new dashboard styling
        ├── context/
        │   └── ShopContext.jsx# Cart, wishlist, and API request dispatches
        ├── components/
        │   ├── Header.jsx     # Navigation, logo, search suggests, profile menu
        │   ├── Footer.jsx     # Philosophy markers, links, newsletter forms
        │   ├── ProductCard.jsx# Reusable product cards
        │   ├── CartDrawer.jsx # Slide-out drawer
        │   └── QuickViewModal.jsx
        └── pages/
            ├── Home.jsx       # Carousel, countdowns, booking and contact forms
            ├── Category.jsx   # Catalog listing filter & search queries
            ├── ProductDetails.jsx # Detailed spec sheet, reviews, zoom magnifier
            ├── Cart.jsx       # Checkout layout & order success overlay
            ├── Wishlist.jsx   # Favorited items grid
            ├── Contact.jsx    # Contact support page
            └── Dashboard.jsx  # Admin Dashboard (Product and Booking Managers)
```

---

## 🛠️ Local Setup & Development

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Install Dependencies
Run the command below in the root folder to automatically install dependencies for the root, client, and server:
```bash
npm run install-all
```

### 3. Run Development Server
To launch both the Vite React dev server (`http://localhost:5173`) and the Express server (`http://localhost:5000`) concurrently, run:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build & Run in Production
To compile the static React assets and host the app entirely from the Express server:
```bash
# Build React client bundle
npm run build

# Start the Express server
npm run server
```
The application will be served at **[http://localhost:5000](http://localhost:5000)**.
