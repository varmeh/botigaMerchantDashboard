import React, { useContext, useEffect, useState } from "react";
import appContext from "../../contexts/AppContext";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import { SearchBarDelivery } from "../../components/common/search-bar/search-bar";
import CommunityList from "../../components/community-list/community-list";
import DeliveryList from "../../components/delivery-view/delivery-list/delivery-list";
import DeliveryDetails from "../../components/delivery-view/delivery-details/delivery-details";
import { setDeliveryStatus, setDeliveryDelayed, getDeliveryByApartment } from "../../services/delivery-service";
import { cancelOrder, setRefundCompleted } from '../../services/order-service';


export function DeliveryScreen() {
    const screenName = 'Delivery';
    const {
        aggregateDelivery,
        fetchAggregateDelivery,
        setError,
        setSelectedDeliveryDate,
        selectedDeliverydate,
        setAggregateDelivery
    } = useContext(appContext);

    const [deliveryFilterList, setDeliveryFilterList] = useState([]);
    const [selectedCommunityId, setSelectedCommunityId] = useState(null);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        initAggregateDeliveryList();
        if (!selectedDeliverydate) {
            setSelectedDeliveryDate(new Date())
        }
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
            const { apartment: { _id } } = (aggregateData[0] || {});
            if (_id) {
                setSelectedCommunityId(_id);
            }
        }
    }

    function clearSearch() {
        setSearchText('');
    }

    function setSearch(event) {
        const { value } = event.target;
        setSearchText(value);
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

    function getAllDeliveryForSelectedCommunity(id) {
        if (!id) {
            return [];
        }
        const deliveryForApt = aggregateDelivery.find(_delivery => _delivery.apartment._id === id) || {};
        return (deliveryForApt.deliveries || []).filter(
            _delivery => (_delivery.buyer.phone || '').includes(searchText)
                || (_delivery.order.number || '').includes(searchText)
        );
    }

    function getSelectedDelivery(selectedCommunityId, selectedDeliveryId) {
        if (selectedCommunityId && selectedDeliveryId) {
            const deliveryForApt = aggregateDelivery.find(_delivery => _delivery.apartment._id === selectedCommunityId) || {};
            return (deliveryForApt.deliveries || []).find(_delivery => _delivery.order.number === selectedDeliveryId);
        }
        return null;
    }

    function getSelectedCommunity(selectedCommunityId) {
        if (selectedCommunityId) {
            const deliveryForApt = aggregateDelivery.find(_delivery => _delivery.apartment._id === selectedCommunityId) || {};
            return (deliveryForApt.apartment || {});
        }
        return null;
    }

    function selectCommunity(id) {
        setSelectedCommunityId(id);
        setSelectedDeliveryId(null);
    }

    async function setDeliveryStausForOrder(orderId, status) {
        try {
            await setDeliveryStatus(orderId, status);
            await getDeliverListByApartmentAndUpdateDelivery();
        } catch (err) {
            setError(true, err);
        } finally {

        }
    }

    async function setOrderDelayed(orderId, newDate) {
        try {
            await setDeliveryDelayed(orderId, newDate);
            getDeliverListByApartmentAndUpdateDelivery();
        } catch (err) {
            setError(true, err);
        } finally {

        }
    }

    async function setOrderCancelled(orderId) {
        try {
            await cancelOrder(orderId);
            getDeliverListByApartmentAndUpdateDelivery();
        } catch (err) {
            setError(true, err);
        } finally {

        }
    }

    async function setOrderRefundComplete(orderId) {
        try {
            await setRefundCompleted(orderId);
            getDeliverListByApartmentAndUpdateDelivery();
        } catch (err) {
            setError(true, err);
        } finally {

        }
    }

    async function getDeliverListByApartmentAndUpdateDelivery() {
        try {
            const { data: { deliveries = [] } } = await getDeliveryByApartment(selectedCommunityId, selectedDeliverydate);
            const selectectedCommunity = aggregateDelivery.find(_delivery => _delivery.apartment._id === selectedCommunityId);
            if (selectectedCommunity) {
                const updatedAggregateDelivery = aggregateDelivery.map(_delivery => {
                    if (_delivery.apartment._id === selectedCommunityId) {
                        return {
                            ..._delivery,
                            deliveries: deliveries.map(_eachDelivery => ({
                                ..._eachDelivery,
                                _id: _eachDelivery.id
                            }))
                        }
                    }
                    return _delivery;
                });
                setAggregateDelivery(updatedAggregateDelivery);
            }
        } catch (err) {
            setError(true, err);
        } finally {

        }
    }

    return (
        <React.Fragment>
            <SearchBarDelivery
                selectedDeliverydate={selectedDeliverydate}
                onDateChange={setSelectedDeliveryDate}
                screenName={screenName}
                reset={clearSearch}
                handleChange={setSearch}
                searchValue={searchText}
                placeHolder={"Enter order or phone number..."} />
            <BotigaPageView>
                <CommunityList
                    aggregateDeliveryForCommunity={aggregateDelivery}
                    selectCommunity={selectCommunity}
                    selectedCommunityId={selectedCommunityId} />
                <DeliveryList
                    setUnsetFilterList={setUnsetFilterList}
                    deliveryFilterList={deliveryFilterList}
                    selectedCommunityId={selectedCommunityId}
                    selectedDeliveryId={selectedDeliveryId}
                    setSelectedDeliveryId={setSelectedDeliveryId}
                    deliveriesForSelectedCommunity={getAllDeliveryForSelectedCommunity(selectedCommunityId)} />
                <DeliveryDetails
                    setOrderDelayed={setOrderDelayed}
                    setDeliveryStausForOrder={setDeliveryStausForOrder}
                    setOrderCancelled={setOrderCancelled}
                    setOrderRefundComplete={setOrderRefundComplete}
                    selectedDelivery={getSelectedDelivery(selectedCommunityId, selectedDeliveryId)}
                    selectedCommunity={getSelectedCommunity(selectedCommunityId)}
                />
            </BotigaPageView>
        </React.Fragment>
    );

}