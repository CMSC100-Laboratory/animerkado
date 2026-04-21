import { getProducts, saveProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const productRoutes = (app) => {
  app.get('/api/products', getProducts);
  app.post('/api/products', saveProduct);
  app.put('/api/products/:productId', updateProduct);
  app.delete('/api/products/:productId', deleteProduct);
}

export default productRoutes;