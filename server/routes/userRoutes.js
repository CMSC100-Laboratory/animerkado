import { getUsers, saveUser } from '../controllers/userController.js';

const userRoutes = (app) => {
  app.get('/api/users', getUsers);
  app.post('/api/users/register', saveUser);
}

export default userRoutes;