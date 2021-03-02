import React from "react";
import BotigaTabs from "../../components/common/BotigaTabs/BotigaTabs";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import { Banners } from "../../components/Banners/Banners";

const tabs = [{
    tabName: 'banners',
    tabView: (
        <BotigaPageView>
            <Banners />
        </BotigaPageView>
    )
}, {
    tabName: 'coupans',
    tabView: <BotigaPageView />

}];

export function PromoScreen() {
    return (
        <React.Fragment>
            <BotigaTabs tabs={tabs} />
        </React.Fragment>
    )
}