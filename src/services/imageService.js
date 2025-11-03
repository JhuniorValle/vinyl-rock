const axios = require('axios');

class ImageService {
    /**
     * Obtiene una imagen aleatoria de Lorem Picsum
     * @returns {Promise<string>} URL de la imagen
     */
    static async getRandomImage() {
        try {
            // Lorem Picsum genera URLs únicas con timestamp
            const timestamp = Date.now();
            const imageUrl = `https://picsum.photos/600/600?random=${timestamp}`;
            
            // Verificar que la URL es accesible
            await axios.head(imageUrl);
            
            return imageUrl;
        } catch (error) {
            console.error('Error obteniendo imagen:', error.message);
            // Imagen por defecto si falla
            return 'https://picsum.photos/600/600?random=1';
        }
    }

    /**
     * Obtiene imagen temática de Unsplash (alternativa)
     * Requiere API key de Unsplash
     */
    static async getVinylImage() {
        try {
            // Puedes usar Unsplash API para imágenes de vinilos reales
            // Por ahora usamos Lorem Picsum
            return await this.getRandomImage();
        } catch (error) {
            return 'https://picsum.photos/600/600';
        }
    }
}

module.exports = ImageService;