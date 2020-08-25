const express = require('express');
const mongoose = require('mongoose');
const orderModel = require('../../models/Orders');
const orderDetailModel = require('../../models/OrderDetails');

const router = express.Router();

const ObjectId = mongoose.Types.ObjectId;

router.get('/', async(req, res) =>{
  res.status(200).send('OK');
});

router.get('/:orderId', async (req, res) => {
  let result = await orderModel.getOrder(req.params.orderId);
  res.status(201).send(result);

  router.get('/:orderId/:orderDetailId', async (req, res) => {
    let result = await orderDetailModel.getOrderDetail(req.params.orderDetailId);
    res.status(201).send(result);
  });
});

module.exports = router;