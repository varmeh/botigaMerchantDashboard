import axios from "../helpers/axios";
import { deleteProductImage } from "./common-service";

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
        imageUrl: imageUrl ? imageUrl : '',
        imageUrlLarge: imageUrlLarge ? imageUrlLarge : '',
        ...(description ? { description } : {}),
        secondaryImageUrls: secondaryImageUrls ? secondaryImageUrls : [],
        'available': true
    });
}

async function updateProduct(productId, categoryId, name, price, mrp, quantity, unit, imageUrl, imageUrlLarge, description, secondaryImageUrls, available) {
    return axios().patch('/api/seller/products', {
        'productId': productId,
        'categoryId': categoryId,
        'name': name,
        'price': price,
        ...(mrp ? { mrp } : {}),
        quantity,
        unit,
        imageUrl: imageUrl ? imageUrl : '',
        imageUrlLarge: imageUrlLarge ? imageUrlLarge : '',
        ...(description ? { description } : {}),
        secondaryImageUrls: secondaryImageUrls ? secondaryImageUrls : [],
        available
    });
}

async function updateProductStatus(categoryId, product, availableStatus) {
    const [quantity, unit] = product.size.split(' ');
    const { imageUrl, imageUrlLarge, secondaryImageUrls } = product;
    return axios().patch('/api/seller/products', {
        'productId': product.id,
        'categoryId': categoryId,
        'name': product.name,
        'price': product.price,
        ...(product.mrp ? { 'mrp': product.mrp } : {}),
        'quantity': quantity,
        'unit': unit,
        'available': availableStatus,
        imageUrl: imageUrl ? imageUrl : '',
        imageUrlLarge: imageUrlLarge ? imageUrlLarge : '',
        secondaryImageUrls: secondaryImageUrls ? secondaryImageUrls : [],
        ...(product.description ? { 'description': product.description } : {}),
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

export { fetchProducts, saveProduct, updateProductStatus, uploadProductImage, deleteProductImage, deleteProduct, updateProduct };