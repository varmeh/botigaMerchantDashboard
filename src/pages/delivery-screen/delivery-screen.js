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
    const [selectedCommunityId, setSelectedCommunityId] = useState(null);

    useEffect(() => {
        initAggregateDeliveryList();
    }, []);

    async function initAggregateDeliveryList() {
        try {
            if (aggregateDelivery.length > 0) {
                setInitialCommunitySelection(aggregateDelivery);
            } else {
                const data = await fetchAggregateDelivery(new Date());
                setInitialCommunitySelection(data);
            }
        } catch (err) {
            setError(true, err);
        }
    }

    function setInitialCommunitySelection(aggregateData) {
        if (aggregateData.length > 0) {
            const { apartment: { _id: aptId } } = (aggregateData[0] || {});
            if (aptId) {
                setSelectedCommunityId(aptId);
            }
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

    function getDeliveryOfApartment(aptId) {
        if (!aptId) {
            return [];
        }
        const deliveryForApt = aggregateDelivery.find(_delivery => _delivery.apartment._id === aptId) || {};
        return (deliveryForApt.deliveries || []);
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
                    aggregateDelivery={aggregateDelivery}
                    setSelectedCommunityId={setSelectedCommunityId}
                    selectedCommunityId={selectedCommunityId} />
                <DeliveryList
                    setUnsetFilterList={setUnsetFilterList}
                    deliveryFilterList={deliveryFilterList}
                    selectedCommunityId={selectedCommunityId}
                    deliveries={getDeliveryOfApartment(selectedCommunityId)} />
            </BotigaPageView>
        </React.Fragment>
    );

}