import axios from "../helpers/axios";
import { deleteProductImage } from "./common-service";

async function uploadBanner(image) {
    var bodyFormData = new FormData();
    bodyFormData.append('image', image);
    return axios().patch('/api/seller/profile/banners/images', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

async function updateBanners(banners) {
    return axios().patch('/api/seller/profile/banners', { banners });
}

async function getBanners() {
    return axios().get("/api/seller/profile/banners");
}

async function getCoupons() {
    return axios().get('/api/seller/profile/coupons');
}

export { uploadBanner, updateBanners, getBanners, deleteProductImage, getCoupons }