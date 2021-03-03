import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { isBackDatedDate } from "../../../helpers/util";

import "./coupon-list.css";

function CouponListHeader({ openAddCouponForm }) {
    return (
        <div className="coupon-header-item">
            <div className="coupon-header-name">coupons</div>
            <Button className="coupon-header-btn" onClick={openAddCouponForm}>+NEW</Button>
        </div>
    )
}


function CouponItem({ coupon, selectedCouponId, selectCoupon }) {
    let couponItemClass = "coupon-item";
    const { couponCode, couponId, expiryDate } = coupon;
    if (couponId === selectedCouponId) {
        couponItemClass = `${couponItemClass} item_selected`;
    }

    function _selectCoupon() {
        selectCoupon(couponId);
    }

    return (
        <div className={couponItemClass} onClick={_selectCoupon}>
            <div className="coupon-name">{couponCode}</div>
            {isBackDatedDate(expiryDate) ? (
                <div className="coupon-info">
                    <div className="coupon-badge">Expired</div>
                </div>
            ) : null}
        </div >
    );
}

export default function CouponList({ coupons, selectedCouponId, selectCoupon, openAddCouponForm }) {
    return (
        <div className="coupon-list-style">
            <CouponListHeader openAddCouponForm={openAddCouponForm} />
            <div className="coupon-list-body">
                {
                    coupons.map((coupon => (
                        <CouponItem coupon={coupon} selectedCouponId={selectedCouponId} selectCoupon={selectCoupon} />
                    )))
                }
            </div>
        </div>
    );
}