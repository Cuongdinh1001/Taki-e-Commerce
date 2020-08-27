const express = require('express');
const saleEventModel = require('../../models/SaleEvents');


const router = express.Router();

router.get('/:saleEventId', async (req, res) => {
  try {
    let result = await saleEventModel.getSaleEvent(req.params.saleEventId);
    delete result._doc._id;
    res.status(200).send(result);
  } catch (error) {
    console.log("Error in saleEvent: router.get() - " + error);
  }
});

router.post('/add', async (req, res) => {
  try {
    let saleEvent = req.body;
    saleEvent.startTime = new Date(saleEvent.startTime);
    saleEvent.endTime = new Date(saleEvent.endTime);
    let result = await saleEventModel.addSaleEvent(saleEvent);
    res.status(200).send({
      message: "Sale Event added successfully",
      request: {
        url: `http://localhost:3000/saleevent/${result._id}`,
        method: 'GET'
      }
    });
  } catch (error) {
    console.log("Error in saleEvent: router.post() - " + error);
  }
});

module.exports = router;