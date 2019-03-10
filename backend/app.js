const express = require('express');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path');

const mongoose = require('mongoose');


const app = express();
mongoose.connect("mongodb://localhost:27017/mypostapp",{ useNewUrlParser: true }).then(() => {
  console.log('Connection successful');
}).catch(() => {
  console.log('Error in connection. Connection failed');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/images', express.static(path.join('backend/images')));
// all request to /images will be directed to backend/images

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);


module.exports = app;
