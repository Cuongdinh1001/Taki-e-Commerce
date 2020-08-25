const mongoose = require('mongoose');
const productModel = require('./Products');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const SaleEventModel = require('./SaleEvents')


const voucherSchema = Schema({
  voucherId: {type: ObjectId, ref: 'SaleEvents'},
  valueDiscount: {type: Number, require: true}
}, {_id: false});

const orderDetailSchema = new Schema({
  _id: {type: ObjectId},
  productId: {type: ObjectId, ref: 'Products'},
  salePrice: {type: Number, require: true},
  quantity: {type: Number, require: true},
  postPrice: {type: Number, require: true},
  voucher: [
    voucherSchema
  ],
  decription: {type: String, maxlength: 100, default: 'Khong'}
});

orderDetailSchema.statics.createOrderDetail = async function(orderDetail) {
  let result = await this.create(orderDetail);
  return result;
}

orderDetailSchema.statics.getOrderDetail = async function(orderDetailId) {
  return await 
    this.findOne(ObjectId(orderDetailId))
    .populate({path: 'productId', model: productModel, select: 'productName category'})
    .populate({path: 'voucher.voucherId', model: SaleEventModel, select: 'eventName discountCode description'});
}

const orderDetailModel = mongoose.model('Order Detail Model', orderDetailSchema, 'OrderDetails');

module.exports = orderDetailModel;