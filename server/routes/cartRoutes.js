import { addToCart, getCartItems, removeFromCart } from '../controllers/cartController.js';

const cartRoutes = (app) => {
  app.post('/api/cart', addToCart);
  app.get('/api/cart', getCartItems);
  app.delete('/api/cart/:itemId', removeFromCart);
}

export default cartRoutes;