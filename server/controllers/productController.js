import { Product } from '../models/Product.js';

const sort_by = new Set([
  'productId', 'productName', 'productType', 'productQuantity', 'price'
])

// GET /api/products with and/or without sorting filters
const getProducts = async (req, res) => {
  try{
    const { sort, order } = req.query;

    let sortField = null;

    if(sort_by.has(sort)){
      sortField = sort;
    }

    let sortOrder = 1;
    if(order === 'desc'){
      sortOrder = -1;
    }

    let sortQuery = {};
    if(sortField){
      sortQuery = {[sortField]: sortOrder};
    }

    const products = await Product.find({}).sort(sortQuery);
    return res.send(products);
  }
  
  catch (error){
    return res.send([]);
  } 

}

// POST /api/products
const saveProduct = async (req, res) => {
  const newProduct = new Product({
    productId:          `P${Date.now()}`, // auto-generated 
    productName:        req.body.productName,
    productImage: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
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
    let updateData = { ...req.body }
    
    // handle file upload
    if (req.file) {
      updateData.productImage = `/uploads/${req.file.filename}`
    }
    // remove imageurl if it exists
    if (updateData.imageUrl === '') {
      delete updateData.imageUrl
    }

    const updated = await Product.updateOne(
      { productId: req.params.productId },
      { $set: updateData }
    )
    return res.send(updated)
  } catch (error) {
    return res.send({ updated: false, error: error.message })
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
