import React from "react";
import { AddNewCoupon } from "./add-new-coupon";
import "./index.css";

function CouponSettingsHeader() {
    return (
        <div className="coupon-settings-header-item">
            <div className="coupon-settings-header-name">COUPON SETTINGS</div>
        </div>
    );
}

function CouponDetail({ coupon, closeAddCouponForm, setError, isAddCoupon, updateScreen }) {
    return (
        coupon != null
            ? <AddNewCoupon
                coupon={coupon}
                closeAddCouponForm={closeAddCouponForm}
                setError={setError}
                isAddCoupon={isAddCoupon}
                updateScreen={updateScreen}
            />
            : (
                <div className="coupon-settings-body">
                    <div className="no-slection">
                        No Coupon selected
                    </div>
                </div>
            )
    );
}

export default function CouponSettings({ isAddCoupon, closeAddCouponForm, coupon, setError, updateScreen }) {
    const defaultCoupon = {};
    return (
        <div className="coupon-settings-style">
            <CouponSettingsHeader />
            {
                isAddCoupon
                    ? <AddNewCoupon
                        isAddCoupon={isAddCoupon}
                        closeAddCouponForm={closeAddCouponForm}
                        coupon={defaultCoupon}
                        setError={setError}
                        updateScreen={updateScreen}
                    />
                    : <CouponDetail
                        isAddCoupon={isAddCoupon}
                        closeAddCouponForm={closeAddCouponForm}
                        coupon={coupon}
                        setError={setError}
                        updateScreen={updateScreen}
                    />
            }
        </div>
    )
}