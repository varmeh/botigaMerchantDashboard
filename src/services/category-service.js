import axios from "../helpers/axios";

async function saveCategory(name) {
    return axios().post('/api/seller/categories', {
        'name': name,
    });
}

async function editCategory(categoryId, name) {
    return axios().patch('/api/seller/categories', {
        'categoryId': categoryId,
        'name': name,
    });
}

async function deleteCategory(categoryId) {
    return axios().delete(`/api/seller/categories/${categoryId}`);
}

export { saveCategory, editCategory, deleteCategory };