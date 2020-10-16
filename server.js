const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDb = require('./config/db');
const User = require('./models/user');
const PORT = process.env.PORT || 5000;

connectDb();

app.use(cors());

app.use(bodyParser.json());

app.use('/user', require('./routes/user.js'));

app.use('/player', require('./routes/player'));

app.use('*', (req, res) => res.status(404).json('Page not found'));

app.listen(PORT, () => {
  console.log('server online');
});
