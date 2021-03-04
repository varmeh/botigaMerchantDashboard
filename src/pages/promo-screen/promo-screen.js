import React from "react";
import BotigaTabs from "../../components/common/BotigaTabs/BotigaTabs";
import { CouponScreen } from "./coupon-screen";
import { BannerScreen } from "./banner-screen";

const tabs = [{
    tabName: 'banners',
    tabView: <BannerScreen />
}, {
    tabName: 'coupons',
    tabView: <CouponScreen />

}];

export function PromoScreen() {
    return (
        <BotigaTabs tabs={tabs} />
    );

}