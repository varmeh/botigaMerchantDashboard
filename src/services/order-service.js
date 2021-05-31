import axios from "../helpers/axios";

async function cancelOrder(orderId) {
  return axios().post("/api/seller/orders/cancel", {
    orderId,
  });
}

async function setRefundCompleted(orderId) {
  return axios().patch("/api/seller/orders/refund/completed", {
    orderId,
  });
}

async function getOrdersByOrderNumber(orderNum) {
  return axios().get(`/api/seller/orders/order/${orderNum}`);
}

async function getOrdersByPhoneNumber(phoneNum) {
  return axios().get(`/api/seller/orders/phone/${phoneNum}`);
}

export {
  cancelOrder,
  setRefundCompleted,
  getOrdersByOrderNumber,
  getOrdersByPhoneNumber,
};
