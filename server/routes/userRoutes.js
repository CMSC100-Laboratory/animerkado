import { verifyAdmin, verifyToken } from '../middleware/middleware.js';
import { getUsers, saveUser , loginUser} from '../controllers/userController.js';

const userRoutes = (app) => {
  //public
  app.post('/api/users/register', saveUser);
  app.post("/api/users/login", loginUser);
  // Protected (admin only)
  app.get('/api/users', verifyToken, verifyAdmin, getUsers);
  
}

export default userRoutes;