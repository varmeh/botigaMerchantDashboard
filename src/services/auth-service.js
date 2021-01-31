import axios from "../helpers/axios";

async function fetchProfile() {
    return axios().get('/api/seller/profile');
}

async function getOTP(phone) {
    return axios().get(`/api/seller/auth/otp/${phone}`);
}

export { fetchProfile, getOTP };