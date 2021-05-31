import React, { useState, useEffect, useContext } from "react";
import appContext from "../../contexts/AppContext";
import OrderList from "../../components/order-view/order-list/order-list";
import OrderDetails from "../../components/order-view/order-detail/order-detail";
import SearchBar from "../../components/common/search-bar/search-bar";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";

import {
  cancelOrder,
  setRefundCompleted,
  getOrdersByOrderNumber,
  getOrdersByPhoneNumber,
} from "../../services/order-service";
import {
  setDeliveryStatus,
  setDeliveryDelayed,
} from "../../services/delivery-service";
import boxOpen from "../../assets/images/box-open.svg";

import "./search-order.css";

export function SearchOrder() {
  const screenName = "Search Orders";

  const [isProcessingOrder, setProcessingOrder] = useState(false);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [orderList, setOrderList] = useState([]);

  const { setError, showMainViewLoader, hideMainViewLoader } =
    useContext(appContext);

  function transformOrderList(orders) {
    return orders.map((_order) => {
      const { payment, refund, buyer, ...others } = _order;
      return {
        _id: others.id,
        order: { ...others },
        payment,
        refund,
        buyer,
      };
    });
  }

  function fetchOrders() {
    if (searchText.trim() === "") {
      return null;
    }
    const func =
      searchText.length === 10
        ? getOrdersByPhoneNumber
        : getOrdersByOrderNumber;

    showMainViewLoader();

    func(searchText.trim())
      .then((res) => {
        const {
          data: { orders = [] },
        } = res;
        const newOrderList = transformOrderList(orders);
        setOrderList(newOrderList);
        setProcessingOrder(false);
        setSelectedOrderNumber(null);
        hideMainViewLoader();
      })
      .catch((err) => {
        hideMainViewLoader();
        setError(true, err);
      });
  }

  function clearSearch() {
    setSearchText("");
    setOrderList([]);
    setProcessingOrder(false);
    setSelectedOrderNumber(null);
  }

  function setSearch(event) {
    const { value } = event.target;
    setSearchText(value);
  }

  // Used for order delayed operation
  async function setOrderDelayed(orderId, newDate) {
    try {
      setProcessingOrder(true);
      await setDeliveryDelayed(orderId, newDate);
      fetchOrders();
    } catch (err) {
      setError(true, err);
    } finally {
      setProcessingOrder(false);
    }
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

  function getSelectedOrder(selectedOrderNumber) {
    return orderList.find(
      (_order) => _order.order.number === selectedOrderNumber
    );
  }

  // Update orders localy.
  function updateDeliveryStatus(orderId, operationType, status, refund) {
    try {
      const updatedOrdeList = orderList.map((_order) => {
        if (_order._id === orderId) {
          return transformOrderAfterUpdate(
            operationType,
            _order,
            status,
            refund
          );
        }
        return _order;
      });
      setOrderList(updatedOrdeList);
    } catch (err) {
      setError(true, err);
    }
  }

  // Transform order obejct after staus change, cancel and refund opration
  function transformOrderAfterUpdate(operationType, orderObj, status, refund) {
    if (operationType === "order-status-change") {
      return {
        ...orderObj,
        order: {
          ...orderObj.order,
          status: status,
        },
      };
    } else if (
      operationType === "order-cancel" ||
      operationType === "refund-complete"
    ) {
      return {
        ...orderObj,
        order: {
          ...orderObj.order,
          status: status,
        },
        refund: orderObj.refund
          ? {
              ...orderObj.refund,
              ...refund,
            }
          : { ...refund },
      };
    } else {
      return orderObj;
    }
  }

  return (
    <React.Fragment>
      <SearchBar
        screenName={screenName}
        reset={clearSearch}
        handleChange={setSearch}
        searchValue={searchText}
        onEnter={fetchOrders}
        placeHolder={"Order or Customer Phone Number"}
      />
      <BotigaPageView>
        {orderList.length === 0 ? (
          <div className={"no-order-container"}>
            <div className="no-order">
              <img className="image-icon" alt={"no-order"} src={boxOpen} />
              <span className="primaryInfo">There are no items here</span>
              <span className="secondaryInfo ">
                Enter order no or customer phone no to see orders and order
                details.
              </span>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <OrderList
              selectedOrderNumber={selectedOrderNumber}
              setSelectedOrderNumber={setSelectedOrderNumber}
              orderList={orderList}
            />
            <OrderDetails
              setOrderDelayed={setOrderDelayed}
              setDeliveryStausForOrder={setDeliveryStausForOrder}
              setOrderCancelled={setOrderCancelled}
              setOrderRefundComplete={setOrderRefundComplete}
              selectedOrder={getSelectedOrder(selectedOrderNumber)}
              isProcessingOrder={isProcessingOrder}
            />
          </React.Fragment>
        )}
      </BotigaPageView>
    </React.Fragment>
  );
}
