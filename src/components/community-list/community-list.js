import React from 'react';
import "./community-list.css";

function CommunityistHeader() {
    return (
        <div className="community-header-item">
            <div className="community-header-name">COMMUNITY</div>
        </div>
    )
}


function CommunityItem({ community }) {
    const { apartmentName } = community;
    return (
        <div className={"community-item"}>
            <div className="community-name">{apartmentName}</div>
        </div>
    );
}

export default function CommunityList({ communties }) {
    return (
        <div className="community-list-style">
            <CommunityistHeader />
            <div className="coupon-list-body">
                {
                    communties.map(((community, i) => (
                        <CommunityItem key={i} community={community} />
                    )))
                }
            </div>
        </div>
    );
}