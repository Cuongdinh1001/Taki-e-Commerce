const express = require('express');
const productModel = require('../../models/Products')

const router = express.Router();

router.get('/:productId', async (req, res) => {
  try {
    let result = await productModel.getProduct(req.params.productId);
    delete result._doc._id;
    res.status(200).send(result);
  } catch (error) {
    console.log("Error in product: router.get() - " + error);
  }
});

router.post('/add', async (req, res) => {
  try {
    let product = req.body;
    let result = await productModel.addProduct(product);
    console.log(result);
    res.status(200).send({
      message: "Product added successfully",
      request: {
        url: `http://localhost:3000/product/${result._id}`,
        method: 'GET'
      }
    });
  } catch (error) {
    console.log("Error in product: router.post() - " + error);
  }
});

module.exports = router;