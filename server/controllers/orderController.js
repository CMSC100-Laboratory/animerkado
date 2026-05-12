import { OrderTransaction } from '../models/OrderTransaction.js';
import { Product } from '../models/Product.js';
import Sale from '../models/Sale.js';

// GET /api/orders
const getOrders = async (req, res) => {
  try{
    const { email } = req.query;

    let filter = {};
    if(email){
      filter = {email: email};
    }

    const order = await OrderTransaction.find(filter)
    return res.send(order);
  }catch(error){
    return res.send([]);
  }
}

// POST /api/orders
const saveOrder = async (req, res) => {
  try {
    // checker if order stocks can accomodate order quantity
    const product = await Product.findOne({ productId: req.body.productId });
    if (!product) {
      return res.send({ inserted: false, error: 'Product not found' });
    }
    if (req.body.orderQuantity > product.productQuantity) {
      return res.send({ inserted: false, error: 'Insufficient stock' });
    }

    const newOrder = new OrderTransaction({
      transactionId: `T${Date.now()}`,
      productId:     req.body.productId,
      orderQuantity: req.body.orderQuantity,
      orderStatus:   0,
      email:         req.body.email,
      dateOrdered:   new Date(),
      time:          new Date().toLocaleTimeString(),
    });

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

      // fetch product to get name and price
      const product = await Product.findOne({ productId: order.productId });

      await Product.updateOne(
        { productId: order.productId },
        { $inc: { productQuantity: -order.orderQuantity } }
      );
      // after setting order as confirmed

          await Sale.create({
            orderId: order.transactionId,
            productId: order.productId,
            productName: product.productName,
            quantity: order.orderQuantity,
            price: product.price,
            total: order.orderQuantity * product.price
          });

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