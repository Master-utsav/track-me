const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI; // MongoDB connection string from .env
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Location schema and model
const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: Number,
});

const Location = mongoose.model('Location', locationSchema);

// Endpoint to receive location data
app.post('/track-location', async (req, res) => {
  const { latitude, longitude, timestamp } = req.body;

  try {
    // Save location data to MongoDB
    const newLocation = new Location({ latitude, longitude, timestamp });
    await newLocation.save();

    console.log(`Location saved: Latitude: ${latitude}, Longitude: ${longitude}, Timestamp: ${timestamp}`);
    res.status(200).send('Location received and saved');
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).send('Error saving location data');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
