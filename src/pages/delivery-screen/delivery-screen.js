import React, { useContext, useEffect, useState } from "react";
import appContext from "../../contexts/AppContext";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import { SearchBarDelivery } from "../../components/common/search-bar/search-bar";
import CommunityList from "../../components/community-list/community-list";
import DeliveryList from "../../components/delivery-view/delivery-list/delivery-list";

export function DeliveryScreen() {
    const screenName = 'Delivery';
    const {
        aggregateDelivery,
        fetchAggregateDelivery,
        setError,
        setSelectedDeliveryDate,
        selectedDeliverydate
    } = useContext(appContext);
    const [deliveryFilterList, setDeliveryFilterList] = useState([]);

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

    function setUnsetFilterList(status) {
        let tempStatusList = [...deliveryFilterList];
        if (tempStatusList.includes(status)) {
            tempStatusList = tempStatusList.filter(_status => _status !== status);
        } else {
            tempStatusList = [...tempStatusList, status];
        }
        setDeliveryFilterList(tempStatusList);
    }


    return (
        <React.Fragment>
            <SearchBarDelivery
                selectedDeliverydate={selectedDeliverydate}
                onDateChange={setSelectedDeliveryDate}
                screenName={screenName}
                reset={() => { }}
                handleChange={() => { }}
                searchValue={""}
                placeHolder={"Enter order or phone number..."} />
            <BotigaPageView>
                <CommunityList
                    aggregateDelivery={aggregateDelivery} />
                <DeliveryList
                    aggregateDelivery={aggregateDelivery}
                    setUnsetFilterList={setUnsetFilterList}
                    deliveryFilterList={deliveryFilterList} />
            </BotigaPageView>
        </React.Fragment>
    );

}