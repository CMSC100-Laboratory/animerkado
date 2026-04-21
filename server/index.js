import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

app.listen(5000)
console.log('Server started at port 5000');

await mongoose.connect('mongodb://127.0.0.1:27017/animerkado');
console.log('Connected to the database...');