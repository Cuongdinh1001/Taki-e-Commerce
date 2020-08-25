const express = require('express');
const productModel = require('../../models/Products')

const router = express.Router();

router.get('/:productId', async (req, res) => {
  let result = await productModel.getProduct(req.params.productId);
  res.status(200).send(result);
});

router.post('/add', async (req, res) => {
  let product = req.body;
  let result = await productModel.addProduct(product);
  res.status(200).send(result);
});

module.exports = router;