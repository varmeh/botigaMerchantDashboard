import React from "react";
import "./delivery-details.css";

function DeliveryDetailsHeader() {
    return (
        <div className="delivery-details-header-item">
            <div className="delivery-details-header-name">Product details</div>

        </div>
    );
}


export default function DeliveryDetails({ selectedDelivery, selectedCommunity }) {
    return (
        <div className="delivery-details-style">
            <DeliveryDetailsHeader />
            {selectedDelivery ? selectedDelivery._id : "no"}
        </div>
    )
}