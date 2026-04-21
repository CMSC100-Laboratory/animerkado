import { Product } from '../models/Product.js';

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.send(products);
  } catch (error) {
    return res.send([]);
  }
}

// POST /api/products
const saveProduct = async (req, res) => {
  const newProduct = new Product({
    productId:          req.body.productId,
    productName:        req.body.productName,
    productDescription: req.body.productDescription,
    productType:        req.body.productType,
    productQuantity:    req.body.productQuantity,
    price:              req.body.price,
  });
  try {
    await newProduct.save();
    return res.send({ inserted: true });
  } catch (error) {
    return res.send({ inserted: false, error: error.message });
  }
}

// PUT /api/products/:productId
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.updateOne(
      { productId: req.params.productId },
      { $set: req.body }
    );
    return res.send(updated);
  } catch (error) {
    return res.send({ updated: false, error: error.message });
  }
}

// DELETE /api/products/:productId
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.deleteOne({ productId: req.params.productId });
    return res.send(deleted);
  } catch (error) {
    return res.send({ deleted: false, error: error.message });
  }
}

export { getProducts, saveProduct, updateProduct, deleteProduct };