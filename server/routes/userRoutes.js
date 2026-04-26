import { getUsers, saveUser , loginUser} from '../controllers/userController.js';

const userRoutes = (app) => {
  app.get('/api/users', getUsers);
  app.post('/api/users/register', saveUser);
  app.post("/login", loginUser);
}

export default userRoutes;