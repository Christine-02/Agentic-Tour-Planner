// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const trips = require('./routes/trips');
const auth = require('./routes/auth');
const Trip = require('./models/Trip');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection with error handling
mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost:27017/tourplanner',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Routes
app.use('/api/auth', auth);
app.use('/api/trips', trips);

app.post('/api/ai/plan', async (req, res) => {
  try {
    const r = await axios.post(
      `${process.env.AI_BASE_URL}/plan_trip`,
      req.body
    );
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Node server on', PORT));
