import { OrderTransaction } from '../models/OrderTransaction.js';
import { Product } from '../models/Product.js';

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await OrderTransaction.find({});
    return res.send(orders);
  } catch (error) {
    return res.send([]);
  }
}

// POST /api/orders
const saveOrder = async (req, res) => {
  const newOrder = new OrderTransaction({
    transactionId: req.body.transactionId,
    productId:     req.body.productId,
    orderQuantity: req.body.orderQuantity,
    orderStatus:   0, // always starts as Pending
    email:         req.body.email,
    dateOrdered:   new Date(),
    time:          new Date().toLocaleTimeString(),
  });
  try {
    await newOrder.save();
    return res.send({ inserted: true });
  } catch (error) {
    return res.send({ inserted: false, error: error.message });
  }
}

// PUT /api/orders/:transactionId — admin confirms order
const updateOrder = async (req, res) => {
  try {
    const order = await OrderTransaction.findOne({ transactionId: req.params.transactionId });
    if (!order) return res.send({ updated: false, error: 'Order not found' });

    // Decrease product quantity when order is confirmed
    if (req.body.orderStatus === 1) {
      await Product.updateOne(
        { productId: order.productId },
        { $inc: { productQuantity: -order.orderQuantity } }
      );
    }

    const updated = await OrderTransaction.updateOne(
      { transactionId: req.params.transactionId },
      { $set: { orderStatus: req.body.orderStatus } }
    );
    return res.send(updated);
  } catch (error) {
    return res.send({ updated: false, error: error.message });
  }
}

// DELETE /api/orders/:transactionId — customer cancels order
const cancelOrder = async (req, res) => {
  try {
    const order = await OrderTransaction.findOne({ transactionId: req.params.transactionId });
    if (!order) return res.send({ canceled: false, error: 'Order not found' });
    if (order.orderStatus !== 0) return res.send({ canceled: false, error: 'Order already confirmed or canceled' });

    const canceled = await OrderTransaction.updateOne(
      { transactionId: req.params.transactionId },
      { $set: { orderStatus: 2 } }
    );
    return res.send(canceled);
  } catch (error) {
    return res.send({ canceled: false, error: error.message });
  }
}

export { getOrders, saveOrder, updateOrder, cancelOrder };