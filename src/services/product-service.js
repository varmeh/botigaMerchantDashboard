import axios from "../helpers/axios";

async function fetchProducts() {
    return axios().get('/api/seller/products');
}

async function deleteProduct(productId, categoryId) {
    return axios().delete(`/api/seller/products/${productId}/categories/${categoryId}`);
}

async function saveProduct(categoryId, name, price, mrp, quantity, unit, imageUrl, imageUrlLarge, description, secondaryImageUrls) {
    return axios().post('/api/seller/products', {
        'categoryId': categoryId,
        'name': name,
        'price': price,
        ...(mrp ? { mrp } : {}),
        'size': { 'quantity': `${quantity}`, 'unit': unit },
        ...(imageUrl ? { imageUrl } : {}),
        ...(imageUrlLarge ? { imageUrlLarge } : {}),
        ...(description ? { description } : {}),
        ...((secondaryImageUrls && secondaryImageUrls.length > 0) ? { secondaryImageUrls } : {}),
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
        ...(product.mrp ? { 'mrp': product.mrp } : {}),
        'quantity': quantity,
        'unit': unit,
        'available': availableStatus,
        'updateImage': false,
        ...(product.imageUrl ? { 'imageUrl': product.imageUrl } : {}),
        ...(product.description ? { 'description': product.description } : {}),
    });
}

async function deleteProductImage(imageUrl) {
    return axios().post('/api/services/image/delete', {
        'imageUrl': imageUrl
    });
}

async function uploadProductImage(image, isMainImage) {
    var bodyFormData = new FormData();
    bodyFormData.append('image', image);
    bodyFormData.append('isMainImage', isMainImage);
    return axios().post('/api/seller/products/images', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export { fetchProducts, saveProduct, updateProductStatus, uploadProductImage, deleteProductImage, deleteProduct };