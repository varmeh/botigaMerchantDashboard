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

async function updateCategoryVisiblity(categoryId, value) {
    return axios().patch('/api/seller/categories/visible', {
        "categoryId": categoryId,
        "visible": value
    })
}

export { saveCategory, editCategory, deleteCategory, updateCategoryVisiblity };