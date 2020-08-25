const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const productSchema = new Schema({
  _id: {type: ObjectId},
  productName: {type: String, maxlength: 100, require: true},
  category: {type: String, require: true, maxlength: 100},
  unitPrice: {type: Number, require: true},
  salePrice: {type: Number, require: true},
  description: {type: String, maxlength: 100, default: 'San pham moi nhap ve'}
});

productSchema.statics.getProduct = async function(productId, option={}) {
  return await this.findOne(ObjectId(productId), option);
}

productSchema.statics.addProduct = async function(product) {
  let { productName, category, unitPrice, salePrice, description } = product;
  return await this.create({
    _id: new ObjectId(),
    productName,
    category,
    unitPrice,
    salePrice,
    description
  })
}

const productModel = mongoose.model('Product Model', productSchema, 'Products');


module.exports = productModel;