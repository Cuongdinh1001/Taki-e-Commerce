import { Router } from 'express';
import { Types } from 'mongoose';
import orderModel from '../../models/Orders';
import orderDetailModel from '../../models/OrderDetails';

const router = Router();

router.get('/', async (req, res) => {
  const lstOrder = await orderModel.getManyOrder(req.query.userId);
  const result = [];

  lstOrder.forEach((order) => {
    order = order.toObject();
    const orderId = order._id;
    delete order._id;
    order.request = {
      url: `http://localhost:3000/order/${orderId}`,
      method: 'GET'
    };
    result.push(order);
  });

  res.status(200).send(result);
});

router.get('/:orderId', async (req, res) => {
  try {
    const result = await orderModel.getOrder(req.params.orderId);
    res.status(200).send(result);
  } catch (error) {
    
  }

  router.get('/:orderId/detail', async (cont_req, res) => {
    const lstOrderDetailId = result.orderDetail;

    const order = ({ ...result })._doc;
    delete order.orderDetail;
    order.orderDetail = [];

    for (let idx = 0; idx < lstOrderDetailId.length; idx++) {
      const orderDetailId = lstOrderDetailId[idx];
      const detail = await orderDetailModel.getOrderDetail(orderDetailId);

      const orderDetail = ({ ...detail })._doc;

      for (let jdx = 0; jdx < orderDetail.voucher.length; jdx++) {
        const voucher = ({ ...orderDetail.voucher[jdx].voucherId })._doc;
        voucher.discountValue = orderDetail.voucher[jdx].discountValue;
        const voucherId = voucher._id;
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
