import { Router } from 'express';
import { Types } from 'mongoose';
import orderModel from '../../models/Orders';
import orderDetail from '../../models/OrderDetails';

const router = Router();

const ObjectId = Types.ObjectId;

router.get('/', async(req, res) =>{
  let lstOrder = await orderModel.getManyOrder(req.query.userId);
  let result = [];

  lstOrder.forEach(o => {
    let order = o._doc;
    const orderId = order._id;
    delete order._id;
    order.request = {
      url: `http://localhost:3000/order/${orderId}`,
      method: 'GET'
    }
    result.push(order)
  });

  res.status(200).send(result);
});

router.get('/:orderId', async (req, res) => {
  let result = await orderModel.getOrder(req.params.orderId);
  res.status(201).send(result);

  router.get('/:orderId/detail', async (req, res) => {
    let lstOrderDetailId = result.orderDetail;

    let order = Object.assign({}, result)._doc;
    delete order.orderDetail;
    order.orderDetail = [];

    for (let idx = 0; idx < lstOrderDetailId.length; idx++) {
      const orderDetailId = lstOrderDetailId[idx];
      let detail = await orderDetail.getOrderDetail(orderDetailId);

      let orderDetail = Object.assign({}, detail)._doc;

      for (let jdx = 0; jdx < orderDetail.voucher.length; jdx++) {
        let voucher = Object.assign({}, orderDetail.voucher[jdx].voucherId)._doc
        voucher.discountValue = orderDetail.voucher[jdx].discountValue;
        const voucherId =voucher._id;
        delete voucher._id;
        voucher.request = {
          url: `${process.env.L_HOST}/saleevent/${voucherId}`,
          method: 'GET'
        };
        orderDetail.voucher[jdx] = voucher;
      }
      
      order.orderDetail.push(orderDetail);  
    }
    res.status(201).send(order);
  });
});

export default router;