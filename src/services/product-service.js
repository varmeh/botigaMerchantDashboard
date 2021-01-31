import axios from "../helpers/axios";

async function getProducts() {
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

export { getProducts, saveProduct };