import { verifyAdmin, verifyToken } from '../middleware/middleware.js';
import { getProducts, saveProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { upload } from "../middleware/upload.js";


const productRoutes = (app) => {
  app.get('/api/products',verifyToken, verifyAdmin, getProducts);
  app.post('/api/products', upload.single("productImage"), verifyToken, verifyAdmin,  saveProduct);
  app.put('/api/products/:productId', verifyToken, verifyAdmin,  updateProduct);
  app.delete('/api/products/:productId', verifyToken, verifyAdmin,  deleteProduct);
 
}

export default productRoutes;