import { Schema as _Schema, Types, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Types.ObjectId;


const productSchema = new Schema({
  _id: {type: ObjectId},
  productName: {type: String, maxlength: 100, require: true},
  category: {type: String, require: true, maxlength: 100},
  unitPrice: {type: Number, require: true},
  salePrice: {type: Number, require: true},
  description: {type: String, maxlength: 100, default: 'San pham moi nhap ve'}
});

productSchema.statics.getProduct = async function(productId, option={}) {
  try {
    let result = await this.findOne(ObjectId(productId), option);
    delete result._doc.__v;
    return result;
  } catch (error) {
    console.log("Error in Product: getProduct() - " + error);
  }
}

productSchema.statics.addProduct = async function(product) {
  try {
    let { productName, category, unitPrice, salePrice, description } = product;
    let result = await this.create({
      _id: new ObjectId(),
      productName: productName,
      category: category,
      unitPrice: unitPrice,
      salePrice: salePrice,
      description: description
    });
    delete result._doc.__v;
    return result;
  } catch (error) {
    console.log("Error in Product: addProduct() - " + error);
  }
}

const productModel = model('Product Model', productSchema, 'Products');


export default productModel;