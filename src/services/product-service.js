import axios from "../helpers/axios";

async function fetchProducts() {
    return axios().get('/api/seller/products');
}

async function saveProduct(categoryId, name, price, quantity, unit, imageUrl, description) {
    return axios().post('/api/seller/products', {
        'categoryId': categoryId,
        'name': name,
        'price': price,
        'size': { 'quantity': `${quantity}`, 'unit': unit },
        'imageUrl': imageUrl,
        'description': description,
        'available': true
    });
}

async function updateProductStatus(categoryId, product, availableStatus) {
    const [quantity, unit] = product.size.split(' ');
    return axios().patch('/api/seller/products', {
        'productId': product.id,
        'categoryId': categoryId,
        'name': product.name,
        'price': product.price,
        'quantity': quantity,
        'unit': unit,
        'available': availableStatus,
        'updateImage': false,
        ...(product.imageUrl ? { 'imageUrl': product.imageUrl } : {}),
        ...(product.description ? { 'description': product.description } : {}),
    });
}

export { fetchProducts, saveProduct, updateProductStatus };