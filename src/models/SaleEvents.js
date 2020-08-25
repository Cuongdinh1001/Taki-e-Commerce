const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;



const saleEventSchema = new Schema({
  _id: {type: ObjectId},
  eventName: {type: String, maxlength: 100, require: true},
  typeDiscount: {type: String, require: true},
  valueDiscount: {type: Number, require: true},
  discountCode: {type: String, require: true, maxlength: 10},
  requirement: {order: {
                  maxDiscount: {type: Number},
                  minValue: {type: Number}
                },
                category: {
                  type: {type: String},
                  minValue: {type: Number}
                },
                product: {
                  productId: {type: ObjectId},
                  minQuantity: {type: Number},
                  minValue: {type: Number}
                }
              },
  numOfVoucher: {type: Number, require: true},
  remaining: {type: Number, require: true},
  startTime: {type: Date, required: true},
  endTime: {type: Date, required: false},
  status: {type: Number, require: true},
  description: {type: String, maxlength: 100, default: 'Mung sinh nhat Cuong <3'}
});

saleEventSchema.statics.getSaleEvent = async function(saleEventId) {
  return await this.findOne(ObjectId(saleEventId));
}

saleEventSchema.statics.addSaleEvent = async function(saleEvent) {
  let { eventName, typeDiscount, valueDiscount, discountCode, 
    requirement, numOfVoucher, startTime, endTime, status, description} = saleEvent;
  return await this.create({
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
    status, description
  });
}

saleEventSchema.statics.updateRemaining = async function(saleEventId, remaining) {
  return await this.updateOne({_id: ObjectId(saleEventId)}, {$set: {remaining: remaining} })
}

saleEventSchema.statics.findVoucher = async function(code, option = {}) {
  return await this.findOne({discountCode: code}, option);
}

const saleEventModel = mongoose.model('Sale Event Model', saleEventSchema, 'SaleEvents');

module.exports = saleEventModel;