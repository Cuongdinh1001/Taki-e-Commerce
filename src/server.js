import express from 'express';
import { connect } from 'mongoose';
import { json, urlencoded } from 'body-parser';

const app = express();

const DB_USERNAME = process.env.DB_ADMIN_USERNAME;
const DB_PASSWORD = process.env.DB_ADMIN_PASSWORD;
const DB_TLD = process.env.DB_ADMIN_TLD;

const mongodbUri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_TLD}`;

connect(
  mongodbUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err) => {
    if (err) console.log(err);
    else console.log('Connect');
  }
);

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('OK');
});

app.use('/', require('./routers/routes').default);

app.listen(process.env.PORT, () => {
  console.log('server is listening at port 3000 ...');
});
