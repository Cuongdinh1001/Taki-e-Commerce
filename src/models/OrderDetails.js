import { Schema as _Schema, Types, model as _model } from 'mongoose';
import productModel from './Products';
const Schema = _Schema;
const ObjectId = Types.ObjectId;
import SaleEventModel from './SaleEvents';


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
    this.findOne(ObjectId(orderDetailId), {_id: 0, __v: 0})
    .populate({path: 'productId', model: productModel, select: 'productName category'})
    .populate({path: 'voucher.voucherId', model: SaleEventModel, select: 'eventName discountCode description'});
}

const orderDetailModel = _model('Order Detail Model', orderDetailSchema, 'OrderDetails');

export default orderDetailModel;