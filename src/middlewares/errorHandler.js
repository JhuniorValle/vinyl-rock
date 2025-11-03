const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.stack);

    // Error de validación de MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'El producto ya existe',
            error: err.message
        });
    }

    // Error de conexión a BD
    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            success: false,
            message: 'Error de conexión a la base de datos',
            error: 'Servicio no disponible'
        });
    }

    // Error genérico
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;