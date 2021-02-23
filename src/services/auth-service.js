import axios from "../helpers/axios";

async function fetchProfile() {
    return axios().get('/api/seller/profile');
}

async function getOTP(phone) {
    return axios().get(`/api/seller/auth/otp/${phone}`);
}

async function verifyOtpValue(phone, sessionId, otpVal) {
    return axios().post(`/api/seller/auth/otp/verify`, {
        phone, sessionId, otpVal
    });
}

async function Logout() {
    return axios().post(`/api/seller/auth/signout`, {});
}

export { fetchProfile, getOTP, verifyOtpValue, Logout };