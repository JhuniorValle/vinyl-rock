const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const validateProduct = require('../middlewares/validateProduct');

// Rutas de productos
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', validateProduct, ProductController.createProduct);
router.put('/products/:id', validateProduct, ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

module.exports = router;