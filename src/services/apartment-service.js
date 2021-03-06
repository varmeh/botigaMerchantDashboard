import axios from "../helpers/axios";

async function fetchApartments() {
    return axios().get('/api/seller/apartments');
}

export { fetchApartments };