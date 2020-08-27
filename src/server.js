const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const app = express();

const DB_USERNAME = process.env.DB_ADMIN_USERNAME;
const DB_PASSWORD = process.env.DB_ADMIN_PASSWORD;
const DB = process.env.DB_ADMIN_DATABASE;

const mongodb_uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB}`;

mongoose.connect(
  mongodb_uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err) => {
    if (err)
      console.log(err);
    else
      console.log("Connect");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('OK');
});

app.use('/', require('./routers/routes'));

app.listen(3000, () => {
  console.log("server is listening at port 3000 ...");
});
