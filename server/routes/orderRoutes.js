import { getOrders, saveOrder, updateOrder, cancelOrder } from '../controllers/orderController.js';

const orderRoutes = (app) => {
  app.get('/api/orders', getOrders);
  app.post('/api/orders', saveOrder);
  app.put('/api/orders/:transactionId', updateOrder);
  app.delete('/api/orders/:transactionId', cancelOrder);
}

export default orderRoutes;
