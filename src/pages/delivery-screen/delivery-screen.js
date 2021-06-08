import React, { useContext, useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import appContext from "../../contexts/AppContext";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import { SearchBarDelivery } from "../../components/common/search-bar/search-bar";
import CommunityList from "../../components/community-list/community-list";
import DeliveryList from "../../components/delivery-view/delivery-list/delivery-list";
import DeliveryDetails from "../../components/delivery-view/delivery-details/delivery-details";
import {
  setDeliveryStatus,
  setDeliveryDelayed,
  getDeliveryByApartment,
  setDeliveryStatusBatch,
} from "../../services/delivery-service";
import { cancelOrder, setRefundCompleted } from "../../services/order-service";
import SelectAllOrder from "../../components/select-all-order/select-all-order";
import { getProductBreakupRows } from "../../helpers/generateDeliveryExcel";

import "./delivery-screen.css";

export function DeliveryScreen() {
  const screenName = "Delivery";
  const {
    aggregateDelivery,
    fetchAggregateDelivery,
    setError,
    setSelectedDeliveryDate,
    selectedDeliverydate,
    setAggregateDelivery,
    showMainViewLoader,
    hideMainViewLoader,
    brandName,
  } = useContext(appContext);

  const [deliveryFilterList, setDeliveryFilterList] = useState(["all"]);
  const [openOrdersId, setOpenOrderIds] = useState([]);
  const [outforDeliveryIds, setOutForDeliveryIds] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isProcessingOrder, setProcessingOrder] = useState(false);
  const [drawerState, setDrawerState] = useState(false);

  useEffect(() => {
    initAggregateDeliveryList();
    if (!selectedDeliverydate) {
      setSelectedDeliveryDate(new Date());
    }
  }, []);

  const toggleDrawer = (val) => {
    setDrawerState(val);
  };

  const breakupList = (deliveries) => {
    const rows = getProductBreakupRows({ deliveryData: deliveries });
    return (
      <div className="delivery-breakup">
        <div className="delivery-breakup-header">
          <div className="delivery-breakup-title">Product Breakup</div>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => toggleDrawer(false)}
          >
            <Close />
          </IconButton>
        </div>
        <table>
          <tr>
            <th>ITEM NAME</th>
            <th className="center-align-item">SIZE</th>
            <th className="center-align-item">TOTAL</th>
          </tr>
          {rows.map((_breakup) => (
            <tr>
              <td>{_breakup.name}</td>
              <td className="center-align-item">{_breakup.unitInfo}</td>
              <td className="center-align-item">{_breakup.quantity}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  };

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
      const {
        apartment: { _id },
      } = aggregateData[0] || {};
      if (_id) {
        setSelectedCommunityId(_id);
      }
    }
  }

  function clearSearch() {
    setSearchText("");
  }

  function setSearch(event) {
    const { value } = event.target;
    setSearchText(value);
  }

  function setFilterList(status) {
    const statusList = [status];
    setDeliveryFilterList(statusList);
  }

  function getAllDeliveryForSelectedCommunity(id) {
    if (!id) {
      return [];
    }
    const deliveryForApt =
      aggregateDelivery.find((_delivery) => _delivery.apartment._id === id) ||
      {};
    return (deliveryForApt.deliveries || []).filter(
      (_delivery) =>
        (_delivery.buyer.phone || "").includes(searchText) ||
        (_delivery.order.number || "").includes(searchText)
    );
  }

  function getSelectedDelivery(selectedCommunityId, selectedDeliveryId) {
    if (selectedCommunityId && selectedDeliveryId) {
      const deliveryForApt =
        aggregateDelivery.find(
          (_delivery) => _delivery.apartment._id === selectedCommunityId
        ) || {};
      return (deliveryForApt.deliveries || []).find(
        (_delivery) => _delivery.order.number === selectedDeliveryId
      );
    }
    return null;
  }

  function getSelectedCommunity(selectedCommunityId) {
    if (selectedCommunityId) {
      const deliveryForApt =
        aggregateDelivery.find(
          (_delivery) => _delivery.apartment._id === selectedCommunityId
        ) || {};
      return deliveryForApt.apartment || {};
    }
    return null;
  }

  function selectCommunity(id) {
    setSelectedCommunityId(id);
    setSelectedDeliveryId(null);
  }

  // Used for seting status to out and deliverd
  async function setDeliveryStausForOrder(orderId, status) {
    try {
      setProcessingOrder(true);
      await setDeliveryStatus(orderId, status);
      updateDeliveryStatus(orderId, "order-status-change", status);
    } catch (err) {
      setError(true, err);
    } finally {
      setProcessingOrder(false);
    }
  }

  // Used for order delayed operation
  async function setOrderDelayed(orderId, newDate) {
    try {
      setProcessingOrder(true);
      await setDeliveryDelayed(orderId, newDate);
      getDeliverListByApartmentAndUpdateDelivery();
    } catch (err) {
      setError(true, err);
    } finally {
      setProcessingOrder(false);
    }
  }

  // Used for order canceled
  async function setOrderCancelled(orderId) {
    try {
      setProcessingOrder(true);
      const {
        data: { refund },
      } = await cancelOrder(orderId);
      updateDeliveryStatus(orderId, "order-cancel", "cancelled", refund);
    } catch (err) {
      setError(true, err);
    } finally {
      setProcessingOrder(false);
    }
  }

  // Used for refund complete
  async function setOrderRefundComplete(orderId) {
    try {
      setProcessingOrder(true);
      const {
        data: { refund },
      } = await setRefundCompleted(orderId);
      updateDeliveryStatus(orderId, "refund-complete", "cancelled", refund);
    } catch (err) {
      setError(true, err);
    } finally {
      setProcessingOrder(false);
    }
  }

  // Update delivery by hitting api.
  async function getDeliverListByApartmentAndUpdateDelivery() {
    try {
      const {
        data: { deliveries = [] },
      } = await getDeliveryByApartment(
        selectedCommunityId,
        selectedDeliverydate
      );
      const selectectedCommunity = aggregateDelivery.find(
        (_delivery) => _delivery.apartment._id === selectedCommunityId
      );
      if (selectectedCommunity) {
        const updatedAggregateDelivery = aggregateDelivery.map((_delivery) => {
          if (_delivery.apartment._id === selectedCommunityId) {
            return {
              ..._delivery,
              deliveries: deliveries.map(({ id, ...others }) => ({
                ...others,
                _id: id,
              })),
              count: deliveries.length,
            };
          }
          return _delivery;
        });
        setAggregateDelivery(updatedAggregateDelivery);
      }
    } catch (err) {
      setError(true, err);
    }
  }

  // Update delivery localy.
  function updateDeliveryStatus(orderId, operationType, status, refund) {
    try {
      const selectectedCommunity = aggregateDelivery.find(
        (_delivery) => _delivery.apartment._id === selectedCommunityId
      );
      if (selectectedCommunity) {
        const updatedAggregateDelivery = aggregateDelivery.map((_delivery) => {
          if (_delivery.apartment._id === selectedCommunityId) {
            return {
              ..._delivery,
              deliveries: _delivery.deliveries.map((_eachDelivery) => {
                if (_eachDelivery._id === orderId) {
                  return transformDeliveryAfterUpdate(
                    operationType,
                    _eachDelivery,
                    status,
                    refund
                  );
                }
                return _eachDelivery;
              }),
            };
          }
          return _delivery;
        });
        setAggregateDelivery(updatedAggregateDelivery);
      }
    } catch (err) {
      setError(true, err);
    }
  }

  // Transform delivery obejct after staus change, cancel and refund opration
  function transformDeliveryAfterUpdate(
    operationType,
    deliveryObj,
    status,
    refund
  ) {
    if (operationType === "order-status-change") {
      return {
        ...deliveryObj,
        order: {
          ...deliveryObj.order,
          status: status,
        },
      };
    } else if (
      operationType === "order-cancel" ||
      operationType === "refund-complete"
    ) {
      return {
        ...deliveryObj,
        order: {
          ...deliveryObj.order,
          status: status,
        },
        refund: deliveryObj.refund
          ? {
              ...deliveryObj.refund,
              ...refund,
            }
          : { ...refund },
      };
    } else {
      return deliveryObj;
    }
  }

  function setUnsetOrderListIds(id, type) {
    if (type === "only-open") {
      let tempList = [...openOrdersId];
      if (tempList.includes(id)) {
        tempList = tempList.filter((_id) => _id !== id);
      } else {
        tempList = [...tempList, id];
      }
      setOpenOrderIds(tempList);
    } else if (type === "out") {
      let tempList = [...outforDeliveryIds];
      if (tempList.includes(id)) {
        tempList = tempList.filter((_id) => _id !== id);
      } else {
        tempList = [...tempList, id];
      }
      setOutForDeliveryIds(tempList);
    }
  }

  //For batch upadtes
  async function batchDeliveriesUpdate(status) {
    try {
      showMainViewLoader();
      if (status === "out") {
        await setDeliveryStatusBatch(status, openOrdersId);
      } else if (status === "delivered") {
        await setDeliveryStatusBatch(status, outforDeliveryIds);
      }
      await getDeliverListByApartmentAndUpdateDelivery();
      resetDeliverScreenState();
    } catch (err) {
      setError(true, err);
    } finally {
      hideMainViewLoader();
    }
  }

  function handleDateChange(date) {
    setSelectedDeliveryDate(date);
    resetDeliverScreenState();
  }

  function resetDeliverScreenState() {
    setDeliveryFilterList(["all"]);
    setOpenOrderIds([]);
    setOutForDeliveryIds([]);
    setSearchText("");
    setProcessingOrder("");
    setSelectedDeliveryId(null);
  }

  return (
    <React.Fragment>
      <SearchBarDelivery
        brandName={brandName}
        aggregateDelivery={aggregateDelivery}
        setError={setError}
        selectedDeliverydate={selectedDeliverydate}
        onDateChange={handleDateChange}
        screenName={screenName}
        reset={clearSearch}
        handleChange={setSearch}
        searchValue={searchText}
        toggleDrawer={toggleDrawer}
        placeHolder={"Enter order or phone number..."}
      />
      <BotigaPageView>
        <CommunityList
          aggregateDeliveryForCommunity={aggregateDelivery}
          selectCommunity={selectCommunity}
          selectedCommunityId={selectedCommunityId}
        />
        <DeliveryList
          setFilterList={setFilterList}
          deliveryFilterList={deliveryFilterList}
          selectedCommunityId={selectedCommunityId}
          selectedDeliveryId={selectedDeliveryId}
          setSelectedDeliveryId={setSelectedDeliveryId}
          deliveriesForSelectedCommunity={getAllDeliveryForSelectedCommunity(
            selectedCommunityId
          )}
          selectedOpenOrders={openOrdersId}
          selectedOutforDeliveryOrders={outforDeliveryIds}
          setUnsetOrderListIds={setUnsetOrderListIds}
        />
        <DeliveryDetails
          setOrderDelayed={setOrderDelayed}
          setDeliveryStausForOrder={setDeliveryStausForOrder}
          setOrderCancelled={setOrderCancelled}
          setOrderRefundComplete={setOrderRefundComplete}
          selectedDelivery={getSelectedDelivery(
            selectedCommunityId,
            selectedDeliveryId
          )}
          selectedCommunity={getSelectedCommunity(selectedCommunityId)}
          isProcessingOrder={isProcessingOrder}
        />
      </BotigaPageView>
      <SelectAllOrder
        deliveriesForSelectedCommunity={getAllDeliveryForSelectedCommunity(
          selectedCommunityId
        )}
        deliveryFilterList={deliveryFilterList}
        setOpenOrderIds={setOpenOrderIds}
        setOutForDeliveryIds={setOutForDeliveryIds}
        selectedOpenOrders={openOrdersId}
        selectedOutforDeliveryOrders={outforDeliveryIds}
        batchDeliveriesUpdate={batchDeliveriesUpdate}
      />
      <Drawer
        onClose={() => toggleDrawer(false)}
        anchor={"right"}
        open={drawerState}
      >
        {breakupList(aggregateDelivery)}
      </Drawer>
    </React.Fragment>
  );
}
