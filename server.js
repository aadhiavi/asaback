const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const formRoutes = require('./routes/formRoutes');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://avintrade:avintrade57@cluster0.ozd9re0.mongodb.net/asa', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB', error));

app.use('/api/forms', formRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
