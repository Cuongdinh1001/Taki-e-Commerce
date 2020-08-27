const express = require('express');
const mongoose = require('mongoose');
const userModel = require('../../models/Users');

const router = express.Router();


router.get('/:userId', async(req, res) => {
  let result = await userModel.getUser(req.params.userId);
  delete result._doc._id
  res.status(200).send(result);
});

router.post('/create', async(req, res) => {
  try {
    let user = req.body;
    let result = await userModel.createUser(user);
    const userId = result._id;
    res.status(200).send({
      message: 'User account was created',
      request: {
        url: `http://localhost:3000/user/${userId}`,
        method: 'GET'
      }
    });
  } catch (error) {
    console.log("Error in user: router.post() - " + error);
  }
  
});

module.exports = router;