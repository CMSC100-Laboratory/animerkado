import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const router = (app) => {
  userRoutes(app);
  productRoutes(app);
  orderRoutes(app);
  cartRoutes(app);
}

export default router;