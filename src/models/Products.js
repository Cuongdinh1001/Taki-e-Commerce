import { Schema as _Schema, Types, model } from 'mongoose';

const Schema = _Schema;
const { ObjectId } = Types;

const productSchema = new Schema({
  _id: { type: ObjectId },
  productName: { type: String, maxlength: 100, require: true },
  category: { type: String, require: true, maxlength: 100 },
  unitPrice: { type: Number, require: true },
  salePrice: { type: Number, require: true },
  description: { type: String, maxlength: 100, default: 'San pham moi nhap ve' }
});

productSchema.statics.getProduct = async function (productId) {
  try {
    let result = await this.findOne(ObjectId(productId));
    result = result.toObject();
    delete result.__v;
    return result;
  } catch (error) {
    console.log(`Error in Product, getProduct(): ${error}`);
    return null;
  }
};

productSchema.statics.addProduct = async function (product) {
  try {
    const result = await this.create({
      _id: new ObjectId(),
      productName: product.productName,
      category: product.category,
      unitPrice: product.unitPrice,
      salePrice: product.salePrice,
      description: product.description
    });
    return result;
  } catch (error) {
    console.log(`Error in Product, addProduct(): ${error}`);
  }
};

const productModel = model('Product Model', productSchema, 'Products');

export default productModel;
