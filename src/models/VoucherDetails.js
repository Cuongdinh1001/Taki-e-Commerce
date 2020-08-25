const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const voucherDetailSchema = Schema({
  _id: {type: ObjectId},
  order: {type: ObjectId, ref: 'Users'},
  orderDate: Date.now(),
  orderValue: {type: Number, require: true},
  orderDetail: {type: ObjectId, ref: 'OrderDetails'},
  voucher: [{ type: ObjectId, ref: 'Vouchers'}]
});

const voucherDetailModel = mongoose.model('Order Model', voucherDetailSchema, 'Orders');

module.exports = voucherDetailModel;