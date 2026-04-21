import { User } from './models/User.js';

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.send([]);
  }
}

// GET /api/users/user
const getUser = async (req, res) => {
  try {
    const user = await User.find({ email: req.query.email });
    return res.send(user);
  } catch (error) {
    return res.send([]);
  }
}

// POST /api/users/save
const saveUser = async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    userType: req.body.userType,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await newUser.save();
    return res.send({ inserted: true });
  } catch (error) {
    return res.send({ inserted: false });
  }
}

export { getUsers, saveUser, getUser };