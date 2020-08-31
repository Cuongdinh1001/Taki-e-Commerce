import { Schema as _Schema, Types, model } from 'mongoose';

const Schema = _Schema;
const { ObjectId } = Types;

const saleEventSchema = new Schema({
  _id: { type: ObjectId },
  eventName: { type: String, maxlength: 100, require: true },
  typeDiscount: { type: String, require: true },
  valueDiscount: { type: Number, require: true },
  discountCode: { type: String, require: true, maxlength: 10 },
  requirement: {
    order: {
      maxDiscount: { type: Number },
      minValue: { type: Number }
    },
    category: {
      type: { type: String },
      minValue: { type: Number }
    },
    product: {
      productId: { type: ObjectId },
      minQuantity: { type: Number },
      minValue: { type: Number }
    }
  },
  numOfVoucher: { type: Number, require: true },
  remaining: { type: Number, require: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: false },
  status: { type: Number, require: true },
  description: { type: String, maxlength: 100, default: 'Mung sinh nhat Cuong <3' }
});

saleEventSchema.statics.getSaleEvent = async function (saleEventId) {
  try {
    let result = await this.findOne(ObjectId(saleEventId));
    result =result.toObject();
    delete result.__v;
    return result;
  } catch (error) {
    console.log(`Error in SaleEvent: getSaleEvent() - ${error}`);
  }
};

saleEventSchema.statics.addSaleEvent = async function (saleEvent) {
  try {
    const {
      eventName, typeDiscount, valueDiscount, discountCode,
      requirement, numOfVoucher, startTime, endTime, status, description
    } = saleEvent;
    const result = await this.create({
      _id: new ObjectId(),
      eventName,
      typeDiscount,
      valueDiscount,
      discountCode,
      requirement,
      numOfVoucher,
      remaining: numOfVoucher.numOfVoucher,
      startTime,
      endTime,
      status,
      description
    });
    return result;
  } catch (error) {
    console.log(`Error in SaleEvent: addSaleEvent() - ${error}`);
  }
};

saleEventSchema.statics.updateRemaining = async function (saleEventId, remaining) {
  const result = await this.updateOne({ _id: ObjectId(saleEventId) }, { $set: { remaining } });
  return result;
};

saleEventSchema.statics.findVoucher = async function (code, option = {}) {
  const result = await this.findOne({ discountCode: code }, option);
  return result;
};

const saleEventModel = model('Sale Event Model', saleEventSchema, 'SaleEvents');

export default saleEventModel;
