import { addToCart, getCartItems, removeFromCart, updateCartQuantity } from '../controllers/cartController.js';

const cartRoutes = (app) => {
  app.post('/api/cart', addToCart);
  app.get('/api/cart', getCartItems);
  app.patch('/api/cart/:itemId', updateCartQuantity);
  app.delete('/api/cart/:itemId', removeFromCart);
};

export default cartRoutes;