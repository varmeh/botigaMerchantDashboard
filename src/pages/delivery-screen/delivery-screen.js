import React from "react";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import SearchBar from "../../components/common/search-bar/search-bar";

export function DeliveryScreen() {
    const screenName = 'Delivery';
    return (
        <React.Fragment>
            <SearchBar screenName={screenName} reset={() => { }} handleChange={() => { }} searchValue={""} placeHolder={"Enter order or phone number..."} />
            <BotigaPageView>
                <h1>dkjdkk</h1>
            </BotigaPageView>
        </React.Fragment>
    );

}