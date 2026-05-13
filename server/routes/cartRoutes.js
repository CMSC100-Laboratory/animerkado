import { addToCart, getCartItems, removeFromCart, clearCart } from '../controllers/cartController.js';

const cartRoutes = (app) => {
  app.post('/api/cart', addToCart);
  app.get('/api/cart', getCartItems);
  app.delete('/api/cart/:itemId', removeFromCart);
  app.delete('/api/cart', clearCart);
}

export default cartRoutes;