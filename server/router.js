import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const router = (app) => {
  userRoutes(app);
  productRoutes(app);
  orderRoutes(app);
}

export default router;