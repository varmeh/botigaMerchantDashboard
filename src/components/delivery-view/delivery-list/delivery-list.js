import React, { useState } from "react";
import "./delivery-list.css";
import paidStamp from "../../../assets/icons/paid.svg";
import { statusMessage, statusColor, transformedStatusFilterList } from "../../../helpers/util";
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';

function DeliveryListHeader({ deliveryFilterList, setUnsetFilterList }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'delivery-filter' : undefined;

    const avialbleStatus = [
        { status: 'open-orders', displayText: 'Open orders' },
        { status: 'out', displayText: 'Out for delivery' },
        { status: 'delivered', displayText: 'Delivered' },
        { status: 'cancelled', displayText: 'Cancelled' }
    ];

    const isfilterWithStatusChecked = status => deliveryFilterList.includes(status);

    return (
        <div className="community-header-item">
            <div className="community-header-name">DELIVERIES</div>
            <div className="no-class">
                <IconButton aria-label="delete" size="small" onClick={handleClick}>
                    {deliveryFilterList.length > 0
                        ? (<Badge color="primary" variant="dot"><FilterListIcon fontSize="small" /></Badge>)
                        : <FilterListIcon fontSize="small" />
                    }
                </IconButton>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <div className="delivery-filter-container">
                        {avialbleStatus.map(_entry => (
                            <div className="delivery-filter-item">
                                <div className="delivery-item-delivery-info">
                                    <span className={statusColor(_entry.status)} />
                                    <span>{_entry.displayText}</span>
                                </div>
                                <Checkbox
                                    color="primary"
                                    size="small"
                                    checked={isfilterWithStatusChecked(_entry.status)}
                                    onChange={() => setUnsetFilterList(_entry.status)}
                                    inputProps={{ 'aria-label': _entry.displayText }}
                                />
                            </div>
                        ))}
                    </div>
                </Popover>
            </div>
        </div>
    );
}


function DeliveryItem({ delivery, setSelectedDeliveryId, selectedDeliveryId }) {
    const {
        buyer: { house, name },
        order: { number, products, totalAmount, status: orderStatus },
        payment: { status: paymentStatus }
    } = delivery;
    const itemText = products.length > 1 ? `${products.length} items` : `${products.length} item`;


    function selectDeliveryId() {
        setSelectedDeliveryId(number)
    }


    const selectedClass = selectedDeliveryId === number
        ? 'delivery-item item_selected'
        : 'delivery-item';

    return (
        <div className={selectedClass} onClick={selectDeliveryId}>
            <div className="delivery-item-row">
                <div className="no-class">
                    <div className="delivery-item-order-info">{house}, {name}</div>
                    <div className="delivery-item-delivery-info uppercase">#{number} . {itemText}</div>
                </div>
                {paymentStatus === "success" ? (
                    <div className="paid-stamp-conatiner">
                        <img src={paidStamp} className="paid-stamp" />
                    </div>
                ) : (<div className="delivery-item-delivery-info total-amount">₹{totalAmount}</div>)}
            </div>
            <div className="delivery-item-row">
                <div className="delivery-item-delivery-info">
                    <span className={statusColor(orderStatus)} />
                    {statusMessage(orderStatus)}
                </div>
                {paymentStatus === "success"
                    ? <div className="delivery-item-delivery-info total-amount">₹{totalAmount}</div>
                    : null}
            </div>
        </div>
    )
}


export default function DeliveryList({
    deliveriesForSelectedCommunity,
    deliveryFilterList,
    setUnsetFilterList,
    setSelectedDeliveryId,
    selectedDeliveryId
}) {
    const statusFilterList = transformedStatusFilterList(deliveryFilterList);
    const AllDeliveriesForSelectedCommunity = statusFilterList.length > 0
        ? deliveriesForSelectedCommunity.filter(
            _delivery => statusFilterList.includes(_delivery.order.status)
        ) : deliveriesForSelectedCommunity;

    return (
        <div className="product-list-style">
            <DeliveryListHeader
                deliveryFilterList={deliveryFilterList}
                setUnsetFilterList={setUnsetFilterList} />
            <div className="delivery-list-body">
                {
                    AllDeliveriesForSelectedCommunity.length > 0 ? AllDeliveriesForSelectedCommunity.map(((_delivery, i) => (
                        <DeliveryItem
                            key={i}
                            delivery={_delivery}
                            selectedDeliveryId={selectedDeliveryId}
                            setSelectedDeliveryId={setSelectedDeliveryId}
                        />
                    )))
                        : (
                            <div className="no-slection no-slection-border-top">
                                No result found
                            </div>
                        )
                }
            </div>
        </div>
    )
}