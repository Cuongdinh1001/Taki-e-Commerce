import { Schema as _Schema, Types, model } from 'mongoose';

const Schema = _Schema;
const { ObjectId } = Types;

const voucherDetailSchema = Schema({
  _id: { type: ObjectId },
  order: { type: ObjectId, ref: 'Users' },
  orderDate: Date.now(),
  orderValue: { type: Number, require: true },
  orderDetail: { type: ObjectId, ref: 'OrderDetails' },
  voucher: [{ type: ObjectId, ref: 'Vouchers' }]
});

const voucherDetailModel = model('Order Model', voucherDetailSchema, 'Orders');

export default voucherDetailModel;
