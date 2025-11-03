const db = require('../config/database');
const ImageService = require('../services/imageService');

class ProductController {
    // GET /api/products - Listar todos los productos
    static async getAllProducts(req, res, next) {
        try {
            const [products] = await db.query(
                'SELECT * FROM products ORDER BY created_at DESC'
            );
            
            res.json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/products/:id - Obtener producto por ID
    static async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            
            const [products] = await db.query(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );
            
            if (products.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
            
            res.json({
                success: true,
                data: products[0]
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/products - Crear nuevo producto
    static async createProduct(req, res, next) {
        try {
            const { name, artist, description, price, stock, genre, release_year } = req.body;
            
            // Obtener imagen automáticamente de API externa
            const image_url = await ImageService.getRandomImage();
            
            const [result] = await db.query(
                `INSERT INTO products (name, artist, description, price, stock, genre, release_year, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, artist, description, price, stock, genre, release_year, image_url]
            );
            
            // Obtener el producto recién creado
            const [newProduct] = await db.query(
                'SELECT * FROM products WHERE id = ?',
                [result.insertId]
            );
            
            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: newProduct[0]
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/products/:id - Actualizar producto
    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { name, artist, description, price, stock, genre, release_year } = req.body;
            
            // Verificar si el producto existe
            const [existingProduct] = await db.query(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );
            
            if (existingProduct.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
            
            await db.query(
                `UPDATE products 
                 SET name = ?, artist = ?, description = ?, price = ?, stock = ?, genre = ?, release_year = ?
                 WHERE id = ?`,
                [name, artist, description, price, stock, genre, release_year, id]
            );
            
            // Obtener el producto actualizado
            const [updatedProduct] = await db.query(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );
            
            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: updatedProduct[0]
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/products/:id - Eliminar producto
    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            
            // Verificar si el producto existe
            const [existingProduct] = await db.query(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );
            
            if (existingProduct.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }
            
            await db.query('DELETE FROM products WHERE id = ?', [id]);
            
            res.json({
                success: true,
                message: 'Producto eliminado exitosamente',
                data: existingProduct[0]
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;