import express from "express";
import { verifyAdmin, verifyToken } from '../../middleware/middleware.js';
import { getUsers, saveUser , loginUser} from '../controllers/userController.js';

const router = express.Router();

// Public
router.post("/api/users/register", saveUser);
router.post("/api/users/login", loginUser);

// Protected (admin only)
router.get("/api/users", verifyToken, verifyAdmin, getUsers);

export default userRoutes;