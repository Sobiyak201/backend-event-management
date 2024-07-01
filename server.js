const express = require('express');//defining
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
const authRoutes = require('./routes/auth');
console.log("success");
app.use('/api', authRoutes);
const eventRoutes = require('./routes/events');

app.use('/api/events', eventRoutes);


const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from localhost:3000
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


mongoose.connect("mongodb://localhost:27017/event-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected Successfully'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
