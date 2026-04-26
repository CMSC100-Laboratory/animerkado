import needle from 'needle';

const BASE = 'http://localhost:5000/api';

// Register a customer
needle.post(`${BASE}/users/register`, {
  firstName: 'Juan',
  lastName: 'dela Cruz',
  email: 'juan@test.com',
  password: '123456'
}, (err, res) => console.log('Register user:', res.body));

// Get all users
needle.get(`${BASE}/users`, (err, res) =>
  console.log('All users:', res.body));

// Add a product
needle.post(`${BASE}/products`, {
  productId: 'P001',
  productName: 'Brown Rice',
  productDescription: 'Fresh brown rice from Laguna',
  productType: 1,
  productQuantity: 100,
  price: 55.00
}, (err, res) => console.log('Save product:', res.body));

needle.post(`${BASE}/products`, {
  productId: 'P002',
  productName: 'Carabao Milk',
  productDescription: 'Fresh carabao milk from Los Banos',
  productType: 2,
  productQuantity: 70,
  price: 100.00
}, (err, res) => console.log('Save product:', res.body));


// Get all products
needle.get(`${BASE}/products`, (err, res) =>
  console.log('All products:', res.body));


// addt'l test case - sort by descending order
needle.get(`${BASE}/products?sort=price&order=desc`, (err, res) =>
  console.log('Products by price DESC:', res.body));

// Create an order
needle.post(`${BASE}/orders`, {
  transactionId: 'T001',
  productId: 'P001',
  orderQuantity: 2,
  email: 'juan@test.com'
}, (err, res) => console.log('Save order:', res.body));


// addt'l test case - get a user's order based on email
needle.get(`${BASE}/orders?email=juan@test.com`, (err, res) =>
  console.log('Orders by juan\'s email:', res.body));

// Get all orders
needle.get(`${BASE}/orders`, (err, res) =>
  console.log('All orders:', res.body));

// Confirm order (admin) — decreases product quantity
needle.put(`${BASE}/orders/T001`, { orderStatus: 1 }, { json: true },
  (err, res) => console.log('Confirm order:', res.body));

// Cancel order (customer)
needle.put(`${BASE}/orders/T001`, { orderStatus: 2 }, { json: true },
  (err, res) => console.log('Cancel order:', res.body));