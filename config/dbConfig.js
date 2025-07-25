const mongoose = require('mongoose');

mongoose.connect(process.env.M0NGO_URL );

const connection = mongoose.connection;

connection.on ('connected', () => {
  console.log('MongoDB connected successfully');
});

connection.on('error', (err) => {
  console.error(`MongoDB connection errors: ${err}`);
});

module.exports = mongoose;