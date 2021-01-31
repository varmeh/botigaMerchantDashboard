import axiosInstance from "../helpers/axios";
import axios from "axios";

async function getPresignedImageUrl() {
    return await axiosInstance().get('/api/services/imageurls/png');
}

async function uploadImageToS3(url, image) {
    return axios.put(url, image);
}


export { getPresignedImageUrl, uploadImageToS3 };