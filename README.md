# 🌾 AniMerkado — Farm-to-Table
A MERN stack e-commerce web application developed for the Department of Agriculture (DA) to facilitate direct transactions between farmers and customers.

---

## Authors
- **Mark Justin Feliciano**
- **Avigail Monsalud**
- **Natasha Lois Montas**
- **Rochelle Laqui**
- **Rafael Sam Olivo**

## 📁 Project Structure
```
final-project/
├── client/                          # React + Vite frontend
│   └── src/
│       ├── assets/
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── UserManagement.jsx
│       │   │   ├── ProductListings.jsx
│       │   │   ├── OrderFulfillment.jsx
│       │   │   └── SalesReport.jsx
│       │   ├── customer/
│       │   │   ├── Cart.jsx
│       │   │   ├── RegisterPage.jsx
│       │   │   ├── Shop.jsx
│       │   │   ├── ProductDetail.jsx
│       │   │   ├── OrderConfirmation.jsx
│       │   │   └── OrderHistory.jsx
│       │   └── default/
│       │       ├── LoginPage.jsx
│       │       └── LandingPage.jsx
│       └── styles/
│           ├── admin/
│           │   ├── Dashboard.css
│           │   ├── UserManagement.css
│           │   ├── ProductListings.css
│           │   ├── OrderFulfillment.css
│           │   └── SalesReport.css
│           ├── customer/
│           │   ├── Cart.css
│           │   ├── RegisterPage.css
│           │   ├── Shop.css
│           │   ├── ProductDetail.css
│           │   ├── OrderConfirmation.css
│           │   └── OrderHistory.css
│           └── default/
│               ├── LoginPage.css
│               └── LandingPage.css
│
└── server/                          # Node.js + Express backend
    ├── index.js
    ├── router.js
    ├── seed.js
    ├── test.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── OrderTransaction.js
    │   ├── Cart.js
    │   └── Sale.js
    ├── controllers/
    │   ├── userController.js
    │   ├── productController.js
    │   ├── orderController.js
    │   ├── cartController.js
    │   └── salesController.js
    └── routes/
        ├── userRoutes.js
        ├── productRoutes.js
        ├── orderRoutes.js
        ├── cartRoutes.js
        └── salesRoutes.js
```

---

## 🛠️ Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | React JS + Vite      |
| Backend    | Node.js + Express JS |
| Database   | MongoDB (local)      |
| ODM        | Mongoose             |
| Auth       | bcrypt + JWT         |
| API Testing| needle               |

---

## ⚙️ Prerequisites

- Node.js v20+
- MongoDB v7+
- npm

---

## 🚀 How to Run

### 1. Start MongoDB
```bash
sudo systemctl start mongod
```

### 2. Seed the admin account (run once)
```bash
cd server
node seed.js
```

### 3. Start the backend server
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### 4. Start the frontend
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`

---

## 🔌 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users + total count (admin only) |
| POST | `/api/users/register` | Register a new customer |
| POST | `/api/users/login` | Login and receive JWT token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports `?sort=&order=`) |
| POST | `/api/products` | Add a new product (admin only) |
| PUT | `/api/products/:productId` | Update a product (admin only) |
| DELETE | `/api/products/:productId` | Delete a product (admin only) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders (supports `?email=` filter) |
| POST | `/api/orders` | Create a new order |
| PUT | `/api/orders/:transactionId` | Confirm or update order status (admin only) |
| DELETE | `/api/orders/:transactionId` | Cancel a pending order |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items (supports `?email=` filter) |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:itemId` | Remove item from cart |

### Sales Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/sales` | Get sales report (requires `?filter=weekly/monthly/annual`) |

---

## 🗄️ Database

- **Database name:** `animerkado`
- **Collections:** `users`, `products`, `ordertransactions`, `carts`, `sales`
- MongoDB is run locally at `mongodb://127.0.0.1:27017`

### Data Models

**User** — `firstName`, `middleName` *(optional)*, `lastName`, `userType`, `email`, `password` *(bcrypt hashed)*

**Product** — `productId`, `productName`, `productDescription`, `productType` *(1 Crop / 2 Poultry)*, `productQuantity`, `price`

**OrderTransaction** — `transactionId`, `productId`, `orderQuantity`, `orderStatus` *(0 Pending / 1 Completed / 2 Canceled)*, `email`, `dateOrdered`, `time`

**Cart** — `email`, `productId`, `productName`, `quantity`, `price`

**Sale** — `orderId`, `productId`, `productName`, `quantity`, `price`, `total`, `date`

---

## 👥 User Types

| Type | Description |
|------|-------------|
| `customer` | Registered users — can browse products, manage cart, and place orders |
| `admin` | Department of Agriculture — manages products, orders, users, and views sales reports. Account is seeded directly into the database via `seed.js` |

---

## 🔐 Authentication

- Passwords are hashed using **bcrypt** before storing in MongoDB
- Login returns a **JWT token** stored in `localStorage` on the frontend
- Token is sent in the `Authorization` header for protected requests
- Admin-only routes are protected by middleware that verifies `userType`

---

## 🧪 Testing the API

With the server running, execute the test script:
```bash
cd server
node test.js
```
This runs needle HTTP requests against all endpoints covering happy paths and edge cases, logging responses to the terminal.