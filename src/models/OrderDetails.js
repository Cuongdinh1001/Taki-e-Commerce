import { Schema as _Schema, Types, model as _model } from 'mongoose';
import productModel from './Products';
import SaleEventModel from './SaleEvents';

const Schema = _Schema;
const { ObjectId } = Types;

const voucherSchema = Schema({
  voucherId: { type: ObjectId, ref: 'SaleEvents' },
  valueDiscount: { type: Number, require: true }
}, { _id: false });

const orderDetailSchema = new Schema({
  _id: { type: ObjectId },
  productId: { type: ObjectId, ref: 'Products' },
  salePrice: { type: Number, require: true },
  quantity: { type: Number, require: true },
  postPrice: { type: Number, require: true },
  voucher: [
    voucherSchema
  ],
  decription: { type: String, maxlength: 100, default: 'Khong' }
});

orderDetailSchema.statics.createOrderDetail = async function (orderDetail) {
  try {
    const result = await this.create(orderDetail);
    return result;
  } catch (error) {
    console.log(`Error in Order Detail Model, method createOrderDetail: ${error}`);
  }
};

orderDetailSchema.statics.getOrderDetail = async function (orderDetailId) {
  try {
    let result = await this.findOne(ObjectId(orderDetailId), { _id: 0, __v: 0 })
      .populate({ path: 'productId', model: productModel, select: 'productName category' })
      .populate({ path: 'voucher.voucherId', model: SaleEventModel, select: 'eventName discountCode description' });
    result = result.toObject();
    delete result.__v;
    return result;
  } catch (error) {
    console.log(`Error in Order Detail Model, method getOrderDetail: ${error}`);
  }
};

const orderDetailModel = _model('Order Detail Model', orderDetailSchema, 'OrderDetails');

export default orderDetailModel;
