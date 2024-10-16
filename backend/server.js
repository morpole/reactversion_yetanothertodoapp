const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const taskRoutes = require('./routes/tasks');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const app = express();

app.use(bodyParser.json());
app.use('/api/tasks', taskRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('Error connecting to MongoDB', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});