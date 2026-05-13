import { User } from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      firstName:  req.body.firstName,
      middleName: req.body.middleName,
      lastName:   req.body.lastName,
      userType:   'customer',
      email:      req.body.email,
      password:   hashedPassword,
    });

    await newUser.save();
    return res.status(201).send({ inserted: true });

  } catch (error) {
    // ✅ Handle duplicate email
    if (error.code === 11000) {
      return res.status(409).send({
        inserted: false,
        error: 'An account with that email already exists.'
      });
    }

    // All other errors
    return res.status(500).send({
      inserted: false,
      error: 'Registration failed. Please try again.'
    });
  }
}

// POST /api/users/login
const loginUser = async (req, res) => {

  try{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      "SECRET_KEY", // later move to .env
      { expiresIn: "1d" }
    );

  return res.send({
    loggedIn: true,
    token,
    email: user.email,
    userType: user.userType
  })

  }catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

export { getUsers, saveUser, loginUser};