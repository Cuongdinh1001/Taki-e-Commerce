const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



const app = express();

const mongodb_uri = "mongodb+srv://cuongdinh1001:KaitoKid1001@cluster0.4b3lu.mongodb.net/Demo?retryWrites=true&w=majority";
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
