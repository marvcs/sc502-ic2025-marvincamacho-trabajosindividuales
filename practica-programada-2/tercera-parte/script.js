// Array para almacenar los productos
let products = [];

// Obtener elementos del DOM
const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productCategoryInput = document.getElementById('productCategory');
const categoryFilterInput = document.getElementById('categoryFilter');
const productList = document.getElementById('productList');

// Función para agregar un producto
function addProduct(event) {
    event.preventDefault();

    const productName = productNameInput.value;
    const productPrice = parseFloat(productPriceInput.value);
    const productCategory = productCategoryInput.value;

    if (productName && productPrice && productCategory) {
        const newProduct = {
            name: productName,
            price: productPrice,
            category: productCategory
        };
        products.push(newProduct);
        displayProducts();
        productForm.reset();
    }
}

// Función para eliminar un producto
function deleteProduct(index) {
    products.splice(index, 1);
    displayProducts();
}

// Función para filtrar productos por categoría
function filterProducts() {
    const category = categoryFilterInput.value;
    displayProducts(category);
}

// Función para mostrar los productos en el DOM
function displayProducts(categoryFilter = '') {
    productList.innerHTML = '';

    let filteredProducts = products;

    if (categoryFilter) {
        filteredProducts = products.filter(product => product.category === categoryFilter);
    }

    filteredProducts.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${product.name}</strong> - $${product.price} - ${product.category}
            <button onclick="deleteProduct(${index})">Eliminar</button>
        `;
        productList.appendChild(listItem);
    });
}

// Event listener para el formulario
productForm.addEventListener('submit', addProduct);

// Event listener para el filtro de categoría
categoryFilterInput.addEventListener('change', filterProducts);

// Mostrar todos los productos al cargar
displayProducts();
