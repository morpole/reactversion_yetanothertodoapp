const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Add this
const taskRoutes = require('./routes/tasks');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: 'https://reactversion-yetanothertodoapp-1.onrender.com' 
}));
app.use(bodyParser.json());
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Temporarily disable serving the frontend for testing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
// });

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI environment variable is not set');
  process.exit(1);
}

if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
  console.error('MONGO_URI is invalid: must start with "mongodb://" or "mongodb+srv://"');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});