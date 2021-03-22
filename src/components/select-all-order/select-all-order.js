import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import { isOpen, isDelayed, isOutForDelivery, isEqualArray, transformedStatusFilterList } from "../../helpers/util";
import "./select-all-order.css";

export default function SelectAllOrder(props) {
    return (
        <React.Fragment>
            <SelectAllOpenOrder {...props} />
            <SelectAllOuForDelivery {...props} />
        </React.Fragment>
    )
}

function SelectAllOpenOrder({
    deliveriesForSelectedCommunity,
    deliveryFilterList,
    setOpenOrderIds,
    selectedOpenOrders,
    batchDeliveriesUpdate,
}) {
    const openOrdersArray = ["open", "delayed"];
    const statusFilterList = transformedStatusFilterList(deliveryFilterList);

    const allOpenOrdersIds = deliveriesForSelectedCommunity.filter(_delivery => {
        const { order: { status } } = _delivery;
        if (isOpen(status) || isDelayed(status)) {
            return true;
        }
        return false;
    }).map(_delivery => _delivery._id);

    function selectAllOpenOrder() {
        setOpenOrderIds(allOpenOrdersIds);
    }

    function deSelectAllOpenOrder() {
        setOpenOrderIds([]);
    }

    function showSelectAllBtn() {
        return !(selectedOpenOrders.length === allOpenOrdersIds.length);
    }

    function showSelectAllContainer() {
        return allOpenOrdersIds.length > 0 && (
            isEqualArray(statusFilterList, openOrdersArray) || selectedOpenOrders.length !== 0
        );
    }

    function isActionBtnDisabled() {
        return selectedOpenOrders.length === 0;
    }

    if (showSelectAllContainer()) {
        return (
            <div className="select-all-order">
                <div className="action-btns-container">
                    {showSelectAllBtn() ? (
                        <Button
                            className="select-all-btn"
                            onClick={selectAllOpenOrder}
                            disableElevation>
                            Select All
                        </Button>
                    ) : (
                        <Button
                            className="select-all-btn"
                            onClick={deSelectAllOpenOrder}
                            disableElevation>
                            Deselect All
                        </Button>
                    )}
                    <Button
                        className="out-for-delivery-btn"
                        variant="contained"
                        color={isActionBtnDisabled() ? 'default' : 'primary'}
                        onClick={() => batchDeliveriesUpdate('out')}
                        disabled={isActionBtnDisabled()}
                        disableElevation>
                        Out for Delivery
                    </Button>
                </div>
            </div>
        )
    }
    return null;
}


function SelectAllOuForDelivery({
    deliveriesForSelectedCommunity,
    deliveryFilterList,
    setOutForDeliveryIds,
    selectedOutforDeliveryOrders,
    batchDeliveriesUpdate,
}) {

    const outForDeliveryArray = ["out"];
    const statusFilterList = transformedStatusFilterList(deliveryFilterList);


    const allOutForDeliveryOrdersIds = deliveriesForSelectedCommunity.filter(_delivery => {
        const { order: { status } } = _delivery;
        if (isOutForDelivery(status)) {
            return true;
        }
        return false;
    }).map(_delivery => _delivery._id);


    function selectAllOutForDeliveryOrders() {
        setOutForDeliveryIds(allOutForDeliveryOrdersIds);
    }

    function deSelectAllOutForDeliveryOrders() {
        setOutForDeliveryIds([]);
    }

    function showSelectAllBtn() {
        return !(selectedOutforDeliveryOrders.length === allOutForDeliveryOrdersIds.length);
    }

    function showSelectAllContainer() {
        return allOutForDeliveryOrdersIds.length > 0 && (
            isEqualArray(statusFilterList, outForDeliveryArray) || selectedOutforDeliveryOrders.length !== 0
        );
    }

    function isActionBtnDisabled() {
        return selectedOutforDeliveryOrders.length === 0;
    }

    if (showSelectAllContainer()) {
        return (
            <div className="select-all-order">
                <div className="action-btns-container">
                    {showSelectAllBtn() ? (
                        <Button
                            className="select-all-btn"
                            onClick={selectAllOutForDeliveryOrders}
                            disableElevation>
                            Select All
                        </Button>
                    ) : (
                        <Button
                            className="select-all-btn"
                            onClick={deSelectAllOutForDeliveryOrders}
                            disableElevation>
                            Deselect All
                        </Button>)
                    }
                    <Button
                        className="mark-deliverd-btn"
                        variant="contained"
                        color={isActionBtnDisabled() ? 'default' : 'primary'}
                        onClick={() => batchDeliveriesUpdate('delivered')}
                        disabled={isActionBtnDisabled()}
                        disableElevation>
                        Mark Delivered
                    </Button>
                </div>
            </div>
        );
    }
    return null;
}