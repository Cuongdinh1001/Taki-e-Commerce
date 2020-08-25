const express = require('express');
const mongoose = require('mongoose');
const userModel = require('../../models/Users');

const router = express.Router();


router.get('/:userId', async(req, res) => {
  let result = await userModel.getUser(req.params.userId);
  res.status(200).send(result);
});

router.post('/create', async(req, res) => {
  let user = req.body;
  let result = await userModel.createUser(user);  
  res.status(200).send(result);
});

module.exports = router;