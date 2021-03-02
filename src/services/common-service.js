import axios from "../helpers/axios";

async function deleteProductImage(imageUrl) {
    return axios().post('/api/services/image/delete', {
        'imageUrl': imageUrl
    });
}

export { deleteProductImage }