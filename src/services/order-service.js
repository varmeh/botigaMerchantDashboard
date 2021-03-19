import axios from "../helpers/axios";

async function cancelOrder(orderId) {
    return axios().post('/api/seller/orders/cancel', {
        orderId
    });
}

async function setRefundCompleted(orderId) {
    return axios().patch('/api/seller/orders/refund/completed', {
        orderId
    });
}

export { cancelOrder, setRefundCompleted };