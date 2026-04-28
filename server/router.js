import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import salesRoutes from './routes/salesRoutes.js';

const router = (app) => {
  userRoutes(app);
  productRoutes(app);
  orderRoutes(app);
  cartRoutes(app);
  salesRoutes(app);
}

export default router;