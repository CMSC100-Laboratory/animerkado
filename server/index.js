import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/placeholder')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));