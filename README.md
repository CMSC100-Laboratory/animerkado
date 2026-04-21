# 🌾 Farm-to-Table

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
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
    ├── index.js
    ├── router.js
    ├── test.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── OrderTransaction.js
    ├── controllers/
    │   ├── userController.js
    │   ├── productController.js
    │   └── orderController.js
    └── routes/
        ├── userRoutes.js
        ├── productRoutes.js
        └── orderRoutes.js
```

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React JS + Vite         |
| Backend   | Node.js + Express JS    |
| Database  | MongoDB (local)         |

---

## 🚀 How to Run

### 1. Start MongoDB
```bash
sudo systemctl start mongod
```

### 2. Start the backend server
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### 3. Start the frontend
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
| GET | `/api/users` | Get all users |
| POST | `/api/users/register` | Register a new customer |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add a new product |
| PUT | `/api/products/:productId` | Update a product |
| DELETE | `/api/products/:productId` | Delete a product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Create a new order |
| PUT | `/api/orders/:transactionId` | Confirm or update order status |
| DELETE | `/api/orders/:transactionId` | Cancel a pending order |

---

## 🗄️ Database

- **Database name:** `placeholder`
- **Collections:** `users`, `products`, `ordertransactions`
- MongoDB is run locally at `mongodb://127.0.0.1:27017`

### Data Models

**User** — `firstName`, `middleName` *(optional)*, `lastName`, `userType`, `email`, `password`

**Product** — `productId`, `productName`, `productDescription`, `productType` *(1 Crop / 2 Poultry)*, `productQuantity`, `price`

**OrderTransaction** — `transactionId`, `productId`, `orderQuantity`, `orderStatus` *(0 Pending / 1 Completed / 2 Canceled)*, `email`, `dateOrdered`, `time`

---

## 🧪 Testing the API

With the server running, execute the test script:
```bash
cd server
node test.js
```
This will run needle HTTP requests against all endpoints and log the responses.

---

## 👥 User Types

| Type | Description |
|------|-------------|
| `customer` | Registered users who can browse and purchase products |
| `admin` | Department of Agriculture — manages products, orders, and users |
