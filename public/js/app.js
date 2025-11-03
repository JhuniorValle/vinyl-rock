// ========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ========================================
const API_URL = 'http://localhost:3000/api';
let allProducts = [];
let currentFilter = 'all';

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// ========================================
// CONFIGURAR EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Formulario de creación
    document.getElementById('productForm').addEventListener('submit', handleCreateProduct);
    
    // Formulario de edición
    document.getElementById('editForm').addEventListener('submit', handleUpdateProduct);
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Botón móvil agregar
    const btnAddMobile = document.getElementById('btnAddMobile');
    if (btnAddMobile) {
        btnAddMobile.addEventListener('click', () => {
            document.getElementById('add-product-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

// ========================================
// CARGAR PRODUCTOS
// ========================================
async function loadProducts() {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        const data = await response.json();
        allProducts = data.data || [];
        
        renderProducts(allProducts);
        updateStats();
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudieron cargar los productos');
    }
}

// ========================================
// RENDERIZAR PRODUCTOS
// ========================================
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="loading">
                <i class="fas fa-compact-disc"></i>
                <p>No hay vinilos disponibles aún</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image_url}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://picsum.photos/600/600?random=${product.id}'">
            
            <div class="product-info">
                ${product.genre ? `<span class="product-genre">${product.genre}</span>` : ''}
                
                <h3 class="product-name">${product.name}</h3>
                <p class="product-artist">
                    <i class="fas fa-user-music"></i> ${product.artist}
                </p>
                
                ${product.release_year ? `
                    <p class="product-year">
                        <i class="fas fa-calendar"></i> ${product.release_year}
                    </p>
                ` : ''}
                
                <p class="product-description">${product.description}</p>
                
                <div class="product-footer">
                    <span class="product-price">$${parseFloat(product.price).toFixed(2)}</span>
                    <span class="product-stock ${getStockClass(product.stock)}">
                        <i class="fas fa-box"></i> ${product.stock} unidades
                    </span>
                </div>
                
                <div class="product-actions">
                    <button class="btn-icon btn-edit" onclick="openEditModal(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id}, '${product.name}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// CREAR PRODUCTO
// ========================================
async function handleCreateProduct(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        artist: document.getElementById('artist').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        genre: document.getElementById('genre').value || null,
        release_year: parseInt(document.getElementById('release_year').value) || null
    };
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al crear producto');
        }
        
        showMessage('✅ ¡Vinilo agregado exitosamente!', 'success');
        document.getElementById('productForm').reset();
        
        // Recargar productos
        await loadProducts();
        
        // Scroll a productos
        setTimeout(() => {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }, 1500);
        
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ ${error.message}`, 'error');
    }
}

// ========================================
// ABRIR MODAL DE EDICIÓN
// ========================================
function openEditModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        showMessage('❌ Producto no encontrado', 'error');
        return;
    }
    
    // Llenar el formulario
    document.getElementById('editId').value = product.id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editArtist').value = product.artist;
    document.getElementById('editDescription').value = product.description;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editStock').value = product.stock;
    document.getElementById('editGenre').value = product.genre || '';
    document.getElementById('editYear').value = product.release_year || '';
    
    // Mostrar modal
    document.getElementById('editModal').classList.add('active');
}

// ========================================
// CERRAR MODAL DE EDICIÓN
// ========================================
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editForm').reset();
}

// ========================================
// ACTUALIZAR PRODUCTO
// ========================================
async function handleUpdateProduct(e) {
    e.preventDefault();
    
    const productId = document.getElementById('editId').value;
    
    const formData = {
        name: document.getElementById('editName').value,
        artist: document.getElementById('editArtist').value,
        description: document.getElementById('editDescription').value,
        price: parseFloat(document.getElementById('editPrice').value),
        stock: parseInt(document.getElementById('editStock').value),
        genre: document.getElementById('editGenre').value || null,
        release_year: parseInt(document.getElementById('editYear').value) || null
    };
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar producto');
        }
        
        closeEditModal();
        showMessage('✅ ¡Vinilo actualizado exitosamente!', 'success');
        
        // Recargar productos
        await loadProducts();
        
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ ${error.message}`, 'error');
    }
}

// ========================================
// ELIMINAR PRODUCTO
// ========================================
async function deleteProduct(productId, productName) {
    if (!confirm(`¿Estás seguro de eliminar "${productName}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar producto');
        }
        
        showMessage('✅ Vinilo eliminado exitosamente', 'success');
        
        // Recargar productos
        await loadProducts();
        
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ ${error.message}`, 'error');
    }
}

// ========================================
// FILTRAR PRODUCTOS
// ========================================
function handleFilter(e) {
    const genre = e.currentTarget.dataset.genre;
    currentFilter = genre;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Filtrar productos
    if (genre === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.genre === genre);
        renderProducts(filtered);
    }
}

// ========================================
// UTILIDADES
// ========================================
function getStockClass(stock) {
    if (stock === 0) return 'out';
    if (stock <= 5) return 'low';
    return '';
}

function showLoading() {
    document.getElementById('productsGrid').innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando vinilos...</p>
        </div>
    `;
}

function showError(message) {
    document.getElementById('productsGrid').innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i>
            <p>${message}</p>
        </div>
    `;
}

function showMessage(message, type) {
    const messageEl = document.getElementById('formMessage');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

function updateStats() {
    const totalProducts = allProducts.length;
    const totalValue = allProducts.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    
    // Puedes agregar más stats aquí
}

// ========================================
// SMOOTH SCROLL (opcional)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});