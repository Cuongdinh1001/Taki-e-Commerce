const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const orderSchema = new Schema({
  _id: {type: ObjectId},
  owner: {type: ObjectId, ref: 'Users'},
  orderDate: {type: Date, required: true},
  orderValue: {type: Number, require: true},
  orderDetail: [{type: ObjectId, ref: 'OrderDetails'}]
});

orderSchema.statics.getOrder = async function(orderId) {
  return await this.findOne(ObjectId(orderId));
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
  return await this.find({owner: ObjectId(userId)});
}

const orderModel = mongoose.model('Order Model', orderSchema, 'Orders');

module.exports = orderModel;