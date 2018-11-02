require('dotenv').config({ silent: true });

const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const routes = require('./routes');


const DBURL = !process.env.DB_URL
  ? 'mongodb://127.0.0.1:27017/dapp'
  : process.env.DB_URL;
//= ============================================================================
/**
 * database config
 */
//= ============================================================================

// Connect to our Database and handle an bad connections
mongoose.connect(
  DBURL,
  { useNewUrlParser: true },
);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.once('connected', () => console.log(`Successfully connected to ${DBURL}`));
mongoose.connection.on('error', (err) => {
  console.log(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});


app.use(cors());
app.use('/', routes);
app.listen(port, () => {
  console.log('server up and running on port', port);
});
