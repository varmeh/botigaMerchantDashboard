import axios from "../helpers/axios";
import { convertTo_YYYY_MM_DD } from "../helpers/util";

async function getAggregateDelivery(date) {
    const deliveryDate = date
        ? date
        : new Date();
    return axios().get(`/api/seller/delivery/aggregate/${convertTo_YYYY_MM_DD(deliveryDate)}`);
}

async function getDeliveryByApartment(aptId, date) {
    return axios().get(`/api/seller/delivery/${aptId}/${convertTo_YYYY_MM_DD(date)}`)
}

async function cancelDelivery(orderId) {
    return axios().post('/api/seller/orders/cancel', { orderId });
}

async function setDeliveryStatus(orderId, status) {
    return axios().patch('/api/seller/delivery/status', {
        orderId, status
    });
}

async function setDeliveryDelayed(orderId, newDate) {
    return axios().patch('/api/seller/delivery/delayed', {
        orderId,
        'newDate': convertTo_YYYY_MM_DD(newDate)
    });
}

export { getAggregateDelivery, getDeliveryByApartment, cancelDelivery, setDeliveryStatus, setDeliveryDelayed };