const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const categoriesController = require('../controllers/categories.controller');
const productsController = require('../controllers/products.controller');
const ordersController = require('../controllers/orders.controller');
const shippingController = require('../controllers/shipping.controller');

const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/login', adminController.login);

// Catégories
router.post('/categories', auth, categoriesController.create);
router.put('/categories/:id', auth, categoriesController.update);
router.delete('/categories/:id', auth, categoriesController.delete);

// Produits
router.post('/products', auth, upload.single('image'), productsController.create);
router.put('/products/:id', auth, upload.single('image'), productsController.update);
router.delete('/products/:id', auth, productsController.delete);

// Commandes
router.get('/orders', auth, ordersController.getAll);
router.put('/orders/:id/status', auth, ordersController.updateStatus);
router.put('/orders/:id/details', auth, ordersController.updateDetails);
router.delete('/orders/:id', auth, ordersController.delete);

// Gestion Livraison (Admin)
router.get('/shipping', auth, shippingController.getAllRates);
router.put('/shipping/toggle', auth, shippingController.toggleShipping);
router.post('/shipping', auth, shippingController.saveRate);
router.delete('/shipping/:id', auth, shippingController.deleteRate);

module.exports = router;