import axios from "../helpers/axios";
import { deleteProductImage } from "./common-service";
import { convertTo_YYYY_MM_DD } from "../helpers/util";

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

async function addCoupon(couponCode, discountType, discountValue, expiryDate, minimumOrderValue, maxDiscountAmount, visibleToAllCustomers) {
    const url = '/api/seller/profile/coupons';
    if (discountType === "percentage") {
        return axios().post(url, {
            couponCode,
            discountType,
            discountValue,
            expiryDate: convertTo_YYYY_MM_DD(expiryDate),
            minimumOrderValue,
            maxDiscountAmount,
            visibleToAllCustomers
        });
    } else {
        return axios().post(url, {
            couponCode,
            discountType,
            discountValue,
            expiryDate: convertTo_YYYY_MM_DD(expiryDate),
            minimumOrderValue,
            visibleToAllCustomers
        });
    }
}

async function updateCoupon(couponId, couponCode, discountType, discountValue, expiryDate, minimumOrderValue, maxDiscountAmount, visibleToAllCustomers) {
    const url = '/api/seller/profile/coupons';
    if (discountType === "percentage") {
        return axios().patch(url, {
            couponId,
            couponCode,
            discountType,
            discountValue,
            expiryDate: convertTo_YYYY_MM_DD(expiryDate),
            minimumOrderValue,
            maxDiscountAmount,
            visibleToAllCustomers
        });
    } else {
        return axios().patch(url, {
            couponId,
            couponCode,
            discountType,
            discountValue,
            expiryDate: convertTo_YYYY_MM_DD(expiryDate),
            minimumOrderValue,
            visibleToAllCustomers
        });
    }
}

async function deleteCoupon(couponId) {
    return axios().delete(`/api/seller/profile/coupons/${couponId}`);
}

export { uploadBanner, updateBanners, getBanners, deleteProductImage, getCoupons, addCoupon, deleteCoupon, updateCoupon }