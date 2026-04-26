import { User } from '../models/User.js';
import bcrypt from "bcryptjs";

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ total: users.length, users });
  } catch (error) {
    return res.send([]);
  }
}

// POST /api/users/register
const saveUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  const newUser = new User({
    firstName:  req.body.firstName,
    middleName: req.body.middleName,
    lastName:   req.body.lastName,
    userType:   'customer', // automatically assigned as customer
    email:      req.body.email,
    password:   req.body.hashedPassword,
  });
  try {
    await newUser.save();
    return res.send({ inserted: true });
  } catch (error) {
    return res.send({ inserted: false, error: error.message });
  }
}



export { getUsers, saveUser };