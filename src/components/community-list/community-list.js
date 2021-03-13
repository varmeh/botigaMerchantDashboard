import React from 'react';
import "./community-list.css";

function CommunityistHeader() {
    return (
        <div className="community-header-item">
            <div className="community-header-name">COMMUNITY</div>
        </div>
    )
}


function CommunityItem({
    apartment: {
        apartmentName = '',
        _id: aptid
    },
    count,
    selectCommunity,
    selectedCommunityId
}) {

    const selectedClass = selectedCommunityId === aptid
        ? 'community-item item_selected'
        : 'community-item';

    function _selectCommunity() {
        selectCommunity(aptid)
    }

    return (
        <div className={selectedClass} onClick={_selectCommunity}>
            <div className="community-name">{apartmentName}</div>
            <div className="community-delivery">{count} deliveries</div>
        </div>
    );
}

export default function CommunityList({
    aggregateDeliveryForCommunity,
    selectCommunity,
    selectedCommunityId,
}) {
    return (
        <div className="community-list-style">
            <CommunityistHeader />
            <div className="coupon-list-body">
                {
                    aggregateDeliveryForCommunity.map(((_delivery, i) => (
                        <CommunityItem
                            key={i}
                            apartment={_delivery.apartment}
                            count={_delivery.count}
                            selectCommunity={selectCommunity}
                            selectedCommunityId={selectedCommunityId}
                        />
                    )))
                }
            </div>
        </div>
    );
}