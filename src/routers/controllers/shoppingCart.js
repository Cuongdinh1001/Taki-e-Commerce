const express = require('express');
const mongoose = require('mongoose');
const productModel = require('../../models/Products')
const userModel = require('../../models/Users');
const saleEventModel = require('../../models/SaleEvents');
const OrderModel = require('../../models/Orders');
const calculateDiscount = require('../../tools/calculateDiscount');
const orderModel = require('../../models/Orders');
const orderDetailModel = require('../../models/OrderDetails');

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.post('/', async (req, res) => {
  let cart = req.body;
  let lstOrderDetail = [];
  let userId = cart.userId;
  let lstProducts = cart.listProduct;
  let lstDiscountCode = cart.listDiscountCode;

  try {

    let lstVoucher = [];

    for (let idx = 0; idx < lstDiscountCode.length; idx++) {
      let code = lstDiscountCode[idx];
      lstVoucher.push(await saleEventModel.findVoucher(code, { description: 0, eventName: 0, __v: 0 }));
    }

    for (let idx = 0; idx < lstProducts.length; idx++) {
      let productDetail = await productModel.getProduct(lstProducts[idx].productId, { unitPrice: 0, description: 0 })
      let detail = Object.assign({},
        productDetail._doc,
        {
          productId: productDetail._id,
          quantity: lstProducts[idx].quantity,
          postPrice: productDetail.salePrice * lstProducts[idx].quantity
        });
      delete detail._id;
      lstOrderDetail.push(detail);
    }

    lstVoucher.forEach(voucher => {
      let message;
      if (voucher.requirement.product.productId) {
        message = calculateDiscount.discountByProduct(lstOrderDetail, voucher);
        lstVoucher.splice(lstVoucher.indexOf(voucher), 1);

        if (message !== "OK") res.status(500).send({
          message: message
        });
      }
    });

    lstVoucher.forEach(voucher => {
      let message;

      if (voucher.requirement.category.type) {
        message = calculateDiscount.discountByCategory(lstOrderDetail, voucher);
      }

      else if (voucher.requirement.order) {
        message = calculateDiscount.discountByOrder(lstOrderDetail, voucher);
      }

      if (message !== "OK") res.status(400).send({
        message
      });
    });

    let totalPrice = 0;
    lstOrderDetail.forEach(order => {
      totalPrice += order.postPrice;
    });

    const order = {
      orderDetail: lstOrderDetail,
      orderValue: totalPrice
    }

    res.send(order);


    router.post('/ok', async (req, res) => {
      try {
        let lstOrderId = [];
        lstOrderDetail.forEach(async (orderDetail) => {
          const orderDetailId = new ObjectId();
          orderDetail._id = orderDetailId;
          lstOrderId.push(orderDetailId)
          delete orderDetail.productName;
          delete orderDetail.category;
  
          await orderDetailModel.createOrderDetail(orderDetail);
        });
  
        const result = await orderModel.createOrder({
          owner: userId,
          orderValue: order.orderValue,
          orderDetail: lstOrderId
        })
        res.send({
          message: "Order was created",
          request: {
            url: `http://localhost:3000/order/${result._id}`,
            method: "GET"
          }
        })
      } catch (error) {
        console.log("Error in shpping cart: router.post(ok) - " + error);
      }
    })
    
  } catch (error) {
    console.log("Error in shpping cart: router.post() - " + error);
    res.status(500).send({
      Error: "Error"
    })
  }
});


module.exports = router;