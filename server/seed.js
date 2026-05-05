import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User.js';

await mongoose.connect('mongodb://127.0.0.1:27017/animerkado');
console.log('Connected to database...');

const existing = await User.findOne({ email: 'admin@da.gov.ph' });
if (existing) {
  console.log('Admin account already exists, skipping...');
  process.exit();
}

const hashedPassword = await bcrypt.hash('admin123', 10);
const admin = new User({
  firstName: 'DA',
  lastName: 'Admin',
  userType: 'admin',
  email: 'admin@da.gov.ph',
  password: hashedPassword,
});

await admin.save();
console.log('Admin account created successfully!');
process.exit();