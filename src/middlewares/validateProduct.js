const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.empty': 'El nombre del álbum es requerido',
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'any.required': 'El nombre es obligatorio'
        }),
    
    artist: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'El artista es requerido',
            'any.required': 'El artista es obligatorio'
        }),
    
    description: Joi.string()
        .min(10)
        .required()
        .messages({
            'string.empty': 'La descripción es requerida',
            'string.min': 'La descripción debe tener al menos 10 caracteres'
        }),
    
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'El precio debe ser un número',
            'number.positive': 'El precio debe ser mayor a 0',
            'any.required': 'El precio es obligatorio'
        }),
    
    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'El stock debe ser un número',
            'number.min': 'El stock no puede ser negativo',
            'any.required': 'El stock es obligatorio'
        }),
    
    genre: Joi.string()
        .valid('Rock Clásico', 'Hard Rock', 'Heavy Metal', 'Punk Rock', 'Alternative Rock', 'Progressive Rock', 'Grunge', 'Indie Rock')
        .optional(),
    
    release_year: Joi.number()
        .integer()
        .min(1950)
        .max(new Date().getFullYear())
        .optional()
});

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors
        });
    }
    
    next();
};

module.exports = validateProduct;