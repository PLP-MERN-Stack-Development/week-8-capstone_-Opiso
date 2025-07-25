require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbConfig = require('./config/dbConfig');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const doctorRoute = require('./routes/doctorRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute); 
app.use('/api/appointment', appointmentRoute);


app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

