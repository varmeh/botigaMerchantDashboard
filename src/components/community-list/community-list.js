import React from 'react';
import "./community-list.css";

function CommunityistHeader() {
    return (
        <div className="community-header-item">
            <div className="community-header-name">COMMUNITY</div>
        </div>
    )
}


function CommunityItem({ apartment: { apartmentName = '' }, count }) {
    return (
        <div className={"community-item"}>
            <div className="community-name">{apartmentName}</div>
            <div className="community-delivery">{count} deliveries</div>
        </div>
    );
}

export default function CommunityList({ aggregateDelivery }) {
    return (
        <div className="community-list-style">
            <CommunityistHeader />
            <div className="coupon-list-body">
                {
                    aggregateDelivery.map(((_delivery, i) => (
                        <CommunityItem key={i} apartment={_delivery.apartment} count={_delivery.count} />
                    )))
                }
            </div>
        </div>
    );
}