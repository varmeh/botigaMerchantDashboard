import React from "react";
import BotigaTabs from "../../components/common/BotigaTabs/BotigaTabs";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import { Banners } from "../../components/Banners/Banners";
import { CouponScreen } from "./coupon-screen";

const tabs = [{
    tabName: 'banners',
    tabView: (
        <BotigaPageView>
            <Banners />
        </BotigaPageView>
    )
}, {
    tabName: 'coupons',
    tabView: <CouponScreen />

}];

export function PromoScreen() {
    return (
        <React.Fragment>
            <BotigaTabs tabs={tabs} />
        </React.Fragment>
    )
}