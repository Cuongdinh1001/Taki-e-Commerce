import { Router } from 'express';
import productModel from '../../models/Products';

const router = Router();

router.get('/:productId', async (req, res) => {
  try {
    const result = await productModel.getProduct(req.params.productId);
    if (result) {
      delete result._id;
      res.status(200).send(result);
    }
    else res.status(404).send({
      message: "Not found product"
    })
    return;
  } catch (error) {
    console.log(`Error in product: router.get() - ${error}`);
    return;
  }
});

router.post('/add', async (req, res) => {
  try {
    const product = req.body;
    const result = await productModel.addProduct(product);
    res.status(200).send({
      message: 'Product added successfully',
      request: {
        url: `${process.env.L_HOST}/product/${result._id}`,
        method: 'GET'
      }
    });
    return;
  } catch (error) {
    console.log(`Error in product: router.post() - ${error}`);
    return;
  }
});

export default router;
