import React from "react";
import "./order-list.css";
import paidStamp from "../../../assets/icons/paid.svg";
import { statusMessage, statusColor } from "../../../helpers/util";

function OrderListHeader() {
  return (
    <div className="order-header-item">
      <div className="order-header-name">ORDERS</div>
    </div>
  );
}

function OrderListItem({ order, setSelectedOrderNumber, selectedOrderNumber }) {
  const {
    buyer: { house, name },
    order: { number, products, totalAmount, status: orderStatus },
    payment: { status: paymentStatus },
  } = order;
  const itemText =
    products.length > 1
      ? `${products.length} items`
      : `${products.length} item`;

  function selectOrder() {
    setSelectedOrderNumber(number);
  }

  const selectedClass =
    selectedOrderNumber === number
      ? "delivery-item item_selected"
      : "delivery-item";

  return (
    <div className={selectedClass} onClick={selectOrder}>
      <div className="delivery-item-row-container">
        <div className="delivery-item-row">
          <div className="no-class">
            <div className="delivery-item-order-info">
              {house}, {name}
            </div>
            <div className="delivery-item-delivery-info uppercase">
              #{number} . {itemText}
            </div>
          </div>
          <div className="delivery-item-delivery-info-order-status">
            <span className={statusColor(orderStatus)} />
            {statusMessage(orderStatus)}
          </div>
        </div>
        <div className="delivery-item-row">
          <div className="delivery-item-delivery-info total-amount">
            ₹{totalAmount}
          </div>
          {paymentStatus === "success" ? (
            <div className="paid-stamp-conatiner">
              <img alt="paid-stamp" src={paidStamp} className="paid-stamp" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function OrderList({
  orderList = [],
  selectedOrderNumber,
  setSelectedOrderNumber,
}) {
  return (
    <div className="product-list-style">
      <OrderListHeader />
      <div className="delivery-list-body">
        {orderList.length > 0 ? (
          orderList.map((_order, i) => (
            <OrderListItem
              key={i}
              order={_order}
              selectedOrderNumber={selectedOrderNumber}
              setSelectedOrderNumber={setSelectedOrderNumber}
            />
          ))
        ) : (
          <div className="no-slection no-slection-border-top">
            No result found
          </div>
        )}
      </div>
    </div>
  );
}
