import axios from "../helpers/axios";

async function fetchCategories() {
    return axios().get('/api/seller/categories');
}

export { fetchCategories };