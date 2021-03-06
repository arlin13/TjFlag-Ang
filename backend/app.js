const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const playersRoutes = require('./routes/players');
const teamsRoutes = require('./routes/teams');
const courtsRoutes = require('./routes/courts');
const tournamentsRoutes = require('./routes/tournaments');

const app = express();

mongoose
  .connect(
    'mongodb+srv://tjflag:' +
      process.env.MONGO_ATLAS_PW +
      '@cluster0-z39cp.mongodb.net/tjflag-test?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/tournaments', tournamentsRoutes);

module.exports = app;
