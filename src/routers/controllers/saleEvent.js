import { Router } from 'express';
import saleEventModel from '../../models/SaleEvents';


const router = Router();

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
        url: `${process.env.L_HOST}/saleevent/${result._id}`,
        method: 'GET'
      }
    });
  } catch (error) {
    console.log("Error in saleEvent: router.post() - " + error);
  }
});

export default router;