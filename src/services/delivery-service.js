import axios from "../helpers/axios";
import { convertTo_YYYY_MM_DD } from "../helpers/util";

async function getAggregateDelivery(date) {
    const deliveryDate = date
        ? date
        : new Date();
    return axios().get(`/api/seller/delivery/aggregate/${convertTo_YYYY_MM_DD(deliveryDate)}`);
}

export { getAggregateDelivery };