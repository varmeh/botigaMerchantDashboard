import axios from "../helpers/axios";
import { convertToRequestFormatDate } from "../helpers/util";

async function getAggregateDelivery(date) {
    const deliveryDate = date
        ? date
        : new Date();
    return axios().get(`/api/seller/delivery/aggregate/${convertToRequestFormatDate(deliveryDate)}`);
}

async function getDeliveryByApartment(aptId, date) {
    return axios().get(`/api/seller/delivery/${aptId}/${convertToRequestFormatDate(date)}?limit=100&page=1`);
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
        'newDate': convertToRequestFormatDate(newDate)
    });
}

async function setDeliveryStatusBatch(status, orderIdList) {
    return axios().patch('/api/seller/delivery/batch/status', {
        status, orderIdList
    });
}

export { getAggregateDelivery, getDeliveryByApartment, cancelDelivery, setDeliveryStatus, setDeliveryDelayed, setDeliveryStatusBatch };