const express = require('express');
const saleEventModel = require('../../models/SaleEvents');


const router = express.Router();

router.get('/:saleEventId', async (req, res) => {
  let result = await saleEventModel.getSaleEvent(req.params.saleEventId);
  if (result) res.status(200).send(result);
  else res.status(404).send('Not Found');
});

router.post('/add', async (req, res) => {
  let saleEvent = req.body;
  saleEvent.startTime = new Date(saleEvent.startTime);
  if (saleEvent.endTime) saleEvent.endTime = new Date(saleEvent.endTime);
  let result = await saleEventModel.addSaleEvent(saleEvent);
  res.status(200).send(result);
});

module.exports = router;