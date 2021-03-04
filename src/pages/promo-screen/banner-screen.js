import React from "react";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import { Banners } from "../../components/Banners/Banners";

export function BannerScreen() {
    return (
        <BotigaPageView>
            <Banners />
        </BotigaPageView>
    );
}