import React from "react";
import "./delivery-list.css";
import paidStamp from "../../../assets/icons/paid.svg";
import { statusMessage, statusColor } from "../../../helpers/util";

function DeliveryListHeader() {
    return (
        <div className="community-header-item">
            <div className="community-header-name">DELIVERIES</div>
        </div>
    )
}


function DeliveryItem({ delivery }) {
    const { buyer: { house, name }, order: { number, products, totalAmount, status: orderStatus }, payment: { status: paymentStatus } } = delivery;
    const itemText = products.length > 1 ? `${products.length} items` : `${products.length} item`;
    return (
        <div className="delivery-item">
            <div className="delivery-item-row">
                <div className="no-class">
                    <div className="delivery-item-order-info">{house}, {name}</div>
                    <div className="delivery-item-delivery-info uppercase">#{number} . {itemText}</div>
                </div>
                {paymentStatus === "success" ? (
                    <div className="paid-stamp-conatiner">
                        <img src={paidStamp} className="paid-stamp" />
                    </div>
                ) : (<div className="delivery-item-delivery-info total-amount">₹{totalAmount}</div>)}
            </div>
            <div className="delivery-item-row">
                <div className="delivery-item-delivery-info">
                    <span className={statusColor(orderStatus)} />
                    {statusMessage(orderStatus)}
                </div>
                {paymentStatus === "success"
                    ? <div className="delivery-item-delivery-info total-amount">₹{totalAmount}</div>
                    : null}
            </div>
        </div>
    )
}


export default function DeliveryList({ aggregateDelivery }) {
    if (aggregateDelivery.length == 0) {
        return null;
    }
    console.log(aggregateDelivery);
    const selectedCommuntityForDelivery = aggregateDelivery[0];
    return (
        <div className="product-list-style">
            <DeliveryListHeader />
            <div className="delivery-list-body">
                {
                    selectedCommuntityForDelivery.deliveries.map(((_delivery, i) => (
                        <DeliveryItem key={i} delivery={_delivery} />
                    )))
                }
            </div>
        </div>
    )
}