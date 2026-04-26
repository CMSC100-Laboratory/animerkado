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

// POST /api/users/login
const loginUser = async (req, res) => {

  try{
    const {email, password} = req.body;

    const user = await User.findOne(email);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      "SECRET_KEY", // later move to .env
      { expiresIn: "1d" }
    );

    return res.send({
      message: "Login successful",
      token,
      user
    });


  }catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

const verifyAdmin = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).send({ message: "Admins only" });
  }
  next();
};

export { getUsers, saveUser, loginUser, verifyAdmin};