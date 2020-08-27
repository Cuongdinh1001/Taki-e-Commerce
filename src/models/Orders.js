import { Schema as _Schema, Types, model as _model } from 'mongoose';
import userModel from './Users';
import orderDetailModel from './OrderDetails';
const Schema = _Schema;
const ObjectId = Types.ObjectId;


const orderSchema = new Schema({
  _id: {type: ObjectId},
  owner: {type: ObjectId, ref: 'Users'},
  orderDate: {type: Date, required: true},
  orderValue: {type: Number, require: true},
  orderDetail: [{type: ObjectId, ref: 'OrderDetails'}]
});

orderSchema.statics.getOrder = async function(orderId) {
  return await this.findOne(ObjectId(orderId), {_id: 0, __v: 0})
    .populate({path: 'owner', model: userModel, select: 'userFullName '});
}

orderSchema.statics.createOrder = async function(order) {
  let { owner, orderValue, orderDetail} = order;
  return await this.create({
    _id: new ObjectId(),
    owner,
    orderDate: Date.now(),
    orderValue,
    orderDetail
  })
}

orderSchema.statics.getManyOrder = async function(userId) {
  return await this.find({owner: ObjectId(userId)}, {__v: 0, orderDetail: 0});
}

const orderModel = _model('Order Model', orderSchema, 'Orders');

export default orderModel;