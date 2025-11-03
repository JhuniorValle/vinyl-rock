require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    🎸 ═══════════════════════════════════════════
       VINYL ROCK STORE API
    ═══════════════════════════════════════════
    🚀 Servidor corriendo en: http://localhost:${PORT}
    📊 Base de datos: ${process.env.DB_NAME}
    🌍 Entorno: ${process.env.NODE_ENV}
    ═══════════════════════════════════════════
    `);
});