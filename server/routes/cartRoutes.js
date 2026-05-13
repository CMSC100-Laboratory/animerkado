import { addToCart, getCartItems, removeFromCart, updateCartQuantity, clearCart } from '../controllers/cartController.js';

const cartRoutes = (app) => {
  app.post('/api/cart', addToCart);
  app.get('/api/cart', getCartItems);
  app.patch('/api/cart/:itemId', updateCartQuantity);
  app.delete('/api/cart/:itemId', removeFromCart);
  app.delete('/api/cart', clearCart);
};

export default cartRoutes;