const express = require('express');
const router = express.Router();

router.use('/user', require('./controllers/user'));
router.use('/order', require('./controllers/order'));
router.use('/product', require('./controllers/product'));
router.use('/saleevent', require('./controllers/saleEvent'));
router.use('/shopping_cart', require('./controllers/shoppingCart'));

module.exports = router;