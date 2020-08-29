import { Schema as _Schema, Types, model as _model } from 'mongoose';
import userModel from './Users';

const Schema = _Schema;
const { ObjectId } = Types;

const orderSchema = new Schema({
  _id: { type: ObjectId },
  owner: { type: ObjectId, ref: 'Users' },
  orderDate: { type: Date, required: true },
  orderValue: { type: Number, require: true },
  orderDetail: [{ type: ObjectId, ref: 'OrderDetails' }]
});

orderSchema.statics.getOrder = async function (orderId) {
  try {
    let result = await this.findOne(ObjectId(orderId), { _id: 0, __v: 0 })
      .populate({ path: 'owner', model: userModel, select: 'userFullName ' });
    result = result.toObject();
    delete result.__v;
    return result;
  } catch (error) {
    console.log(`Error in Order Model, getOrder(): ${error}`);
  }
};

orderSchema.statics.createOrder = async function (order) {
  try {
    const result = await this.create({
      _id: new ObjectId(),
      owner: order.owner,
      orderDate: Date.now(),
      orderValue: order.orderValue,
      orderDetail: order.orderDetail
    });
  
    return result;
  } catch (error) {
    console.log(`Error in Order Model, createOrder(): ${error}`);
  }
};

orderSchema.statics.getManyOrder = async function (userId) {
  try {
    const result = await this.find({ owner: ObjectId(userId) }, { __v: 0, orderDetail: 0 });
    return result;
  } catch (error) {
    console.log(`Error in Order Model, getManyOrder(): ${error}`);
  }
};

const orderModel = _model('Order Model', orderSchema, 'Orders');

export default orderModel;
