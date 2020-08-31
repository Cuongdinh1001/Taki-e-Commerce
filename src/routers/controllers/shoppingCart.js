import { Router } from 'express';
import { Types } from 'mongoose';
import productModel from '../../models/Products';
import saleEventModel from '../../models/SaleEvents';
import { discountByProduct, discountByCategory, discountByOrder } from '../../tools/calculateDiscount';
import orderModel from '../../models/Orders';
import orderDetailModel from '../../models/OrderDetails';

const { ObjectId } = Types;

const router = Router();

router.post('/', async (req, res) => {
  const cart = req.body;
  const lstOrderDetail = [];
  const { userId } = cart;
  const lstProducts = cart.listProduct;
  const lstDiscountCode = cart.listDiscountCode;

  try {
    const lstVoucher = [];

    for (let idx = 0; idx < lstDiscountCode.length; idx++) {
      const code = lstDiscountCode[idx];
      const voucher = await saleEventModel.findVoucher(code, { description: 0, eventName: 0, __v: 0 });
      if (voucher) lstVoucher.push(voucher);
      else {
        res.status(404).send({
          message: `${code} not found`
        });
        return;
      }
    }

    for (let idx = 0; idx < lstProducts.length; idx++) {
      const productDetail = await productModel.getProduct(lstProducts[idx].productId);
      if (!productDetail) {
        res.status(404).send({
          message: `${lstProducts[idx].productId} not found`
        });
        return;
      }
      else {
        delete productDetail.unitPrice;
        const detail = {
          ...productDetail,
          productId: productDetail._id,
          quantity: lstProducts[idx].quantity,
          postPrice: productDetail.salePrice * lstProducts[idx].quantity
        };
        delete detail._id;
        lstOrderDetail.push(detail);
      }
    }

    for (let idx = 0; idx < lstVoucher.length; idx++) {
      const voucher = lstVoucher[idx];
      let message;
      if (voucher.requirement.product.productId) {
        message = discountByProduct(lstOrderDetail, voucher);
        lstVoucher.splice(lstVoucher.indexOf(voucher), 1);

        if (message !== 'OK') {
          res.status(400).send({
            message
          });
          return;
        }
      }
    }

    for (let idx = 0; idx < lstVoucher.length; idx++) {
      const voucher = lstVoucher[idx];
      let message;

      if (voucher.requirement.category.type) {
        message = discountByCategory(lstOrderDetail, voucher);
      } else if (voucher.requirement.order) {
        message = discountByOrder(lstOrderDetail, voucher);
      }

      if (message !== 'OK') {
        res.status(400).send({
          message
        });
        return;
      }
    }

    let totalPrice = 0;
    lstOrderDetail.forEach((order) => {
      totalPrice += order.postPrice;
    });

    const order = {
      orderDetail: lstOrderDetail,
      orderValue: totalPrice
    };

    res.send(order);

    router.post('/ok', async (cont_req, res) => {
      try {
        const lstOrderId = [];
        lstOrderDetail.forEach(async (orderDetail) => {
          const orderDetailId = new ObjectId();
          orderDetail._id = orderDetailId;
          lstOrderId.push(orderDetailId);
          delete orderDetail.productName;
          delete orderDetail.category;

          await orderDetailModel.createOrderDetail(orderDetail);
        });

        const result = await orderModel.createOrder({
          owner: userId,
          orderValue: order.orderValue,
          orderDetail: lstOrderId
        });
        res.send({
          message: 'Order was created',
          request: {
            url: `${process.env.L_HOST}/order/${result._id}`,
            method: 'GET'
          }
        });
      } catch (error) {
        console.log(`Error in shpping cart: router.post(ok) - ${error}`);
      }
    });
  } catch (error) {
    console.log(`Error in shpping cart: router.post() - ${error}`);
    res.status(500).send({
      Error: 'Error'
    });
  }
});

export default router;
