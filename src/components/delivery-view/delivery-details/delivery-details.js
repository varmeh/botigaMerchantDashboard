import React from "react";
import PhoneIcon from '@material-ui/icons/Phone';
import Tooltip from '@material-ui/core/Tooltip';

import "./delivery-details.css";

function DeliveryDetailsHeader() {
    return (
        <div className="delivery-details-header-item">
            <div className="delivery-details-header-name">Product details</div>
        </div>
    );
}

function DeliveryOverview({ selectedDelivery, selectedCommunity }) {
    const {
        buyer: {
            name,
            house,
            phone
        },
        order: {
            number,
        },
        createdAt: orderDate
    } = selectedDelivery;
    const { apartmentName, apartmentArea } = selectedCommunity;
    return (
        <React.Fragment>
            <div className="delivery-details-row">
                <div className="buyer-name left-align-item">{name}</div>
                <div className="delivery-info right-align-item">
                    <div className="no-class">Order No: #{number}</div>
                    <div className="delivery-info-row">
                        {`${new Date(orderDate).toLocaleDateString('en-us', { month: 'short', year: 'numeric', day: 'numeric' })} ${new Date(orderDate).toLocaleTimeString('en-us', {
                            hour12: true, hour: 'numeric',
                            minute: 'numeric'
                        }).toUpperCase()}`}
                    </div>
                </div>
            </div>
            <div className="delivery-details-row">
                <div className="delivery-info">
                    <div className="no-class">DELIVER TO</div>
                    <div className="delivery-info-row delivery-info-black">
                        {`${house} ${apartmentName}, ${apartmentArea}`}
                    </div>
                </div>
                <div className="delivery-query-info-box">
                    <div className="delivery-info">Queries on order or Payment? Contact customer directly.</div>
                    <Tooltip title={<span className="contact-tooltip">{phone}</span>} arrow>
                        <div className="delivery-contact-info">
                            <PhoneIcon fontSize="small" />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </React.Fragment>
    );
}

function DeliverySummary({ selectedDelivery }) {
    const { order } = selectedDelivery;
    return (
        <React.Fragment>
            <div className="delivery-summary-full-divider" />
            <div className="delivery-details-row">
                <div className="delivery-info left-align-item">{order.products.length > 1 ? `${order.products.length} Items` : `${order.products.length} Item`}</div>
                <div className="delivery-info-black left-align-item">₹{order.totalAmount}</div>
            </div>
            <div className="delivery-summary-row-divider" />
            {order.products.map((_product, index) => (
                <div key={index} className={index % 2 !== 0 ? "delivery-details-row delivery-summary-shade-row" : "delivery-details-row"}>
                    <div className="delivery-info-black left-align-item">{`${_product.quantity} x ${_product.name}`}</div>
                    <div className="delivery-info-black left-align-item">₹{_product.quantity * _product.price}</div>
                </div>
            ))}
        </React.Fragment >
    )
}

function DeliveryFeesAndDiscount({ selectedDelivery }) {
    const { order: { couponCode, discountAmount, deliveryFee, totalAmount } } = selectedDelivery;
    const hasCoupon = (couponCode) => couponCode != '' && couponCode != null;

    const hasDeliveryFee = (deliveryFee) =>
        deliveryFee != 0 && deliveryFee != null && deliveryFee.toString() != '';

    if (hasCoupon(couponCode) || hasDeliveryFee(deliveryFee)) {
        return (
            <React.Fragment>
                <div className="delivery-details-row">
                    <div className="delivery-info-black left-align-item">Items total</div>
                    <div className="delivery-info-black left-align-item">₹{totalAmount + discountAmount - deliveryFee}</div>
                </div>
                {hasDeliveryFee(deliveryFee) && (
                    <div className="delivery-details-row">
                        <div className="delivery-info-black left-align-item">Delivery Fee</div>
                        <div className="delivery-info-black left-align-item">₹{deliveryFee}</div>
                    </div>
                )}
                {hasCoupon(couponCode) && (
                    <div className="delivery-details-row">
                        <div className="delivery-info-black left-align-item">Coupon Applied ({couponCode})</div>
                        <div className="delivery-info-primary left-align-item">-₹{discountAmount}</div>
                    </div>
                )}
            </React.Fragment>
        )
    } else {
        return null;
    }
}

function DeliveryTotal({ selectedDelivery }) {
    const { order: { totalAmount } } = selectedDelivery;
    return (
        <React.Fragment>
            <div className="delivery-summary-row-divider" />
            <div className="delivery-details-row">
                <div className="delivery-info-black delivery-info-bold left-align-item">Total</div>
                <div className="delivery-info-black delivery-info-bold left-align-item">₹{totalAmount}</div>
            </div>
        </React.Fragment>
    );
}

export default function DeliveryDetails({ selectedDelivery, selectedCommunity }) {
    if (!selectedDelivery || !selectedCommunity) {
        return null;
    }
    return (
        <div className="delivery-details-style">
            <DeliveryDetailsHeader />
            <div className="delivery-details-body">
                <DeliveryOverview selectedDelivery={selectedDelivery} selectedCommunity={selectedCommunity} />
                <DeliverySummary selectedDelivery={selectedDelivery} />
                <DeliveryFeesAndDiscount selectedDelivery={selectedDelivery} />
                <DeliveryTotal selectedDelivery={selectedDelivery} />
            </div>
        </div>
    )
}