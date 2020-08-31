import { Router } from 'express';

const router = Router();

router.use('/user', require('./controllers/user').default);
router.use('/order', require('./controllers/order').default);
router.use('/product', require('./controllers/product').default);
router.use('/saleevent', require('./controllers/saleEvent').default);
router.use('/shopping_cart', require('./controllers/shoppingCart').default);

export default router;
