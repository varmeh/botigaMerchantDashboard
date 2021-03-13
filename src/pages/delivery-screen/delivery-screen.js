import React, { useContext, useEffect } from "react";
import appContext from "../../contexts/AppContext";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import SearchBar from "../../components/common/search-bar/search-bar";
import CommunityList from "../../components/community-list/community-list";
import DeliveryList from "../../components/delivery-view/delivery-list/delivery-list";

export function DeliveryScreen() {
    const screenName = 'Delivery';
    const { aggregateDelivery, fetchAggregateDelivery, setError } = useContext(appContext);

    useEffect(() => {
        initApartmentList();
    }, []);

    async function initApartmentList() {
        try {
            if (aggregateDelivery.length > 0) {
                // set selection logic
            } else {
                //fetch list and set initial selection logic
                await fetchAggregateDelivery(new Date());
            }
        } catch (err) {
            setError(true, err);
        }
    }


    return (
        <React.Fragment>
            <SearchBar screenName={screenName} reset={() => { }} handleChange={() => { }} searchValue={""} placeHolder={"Enter order or phone number..."} />
            <BotigaPageView>
                <CommunityList
                    aggregateDelivery={aggregateDelivery} />
                <DeliveryList
                    aggregateDelivery={aggregateDelivery} />
            </BotigaPageView>
        </React.Fragment>
    );

}