import React from "react";
import "./delivery-list.css";
import paidStamp from "../../../assets/icons/paid.svg";
import { statusMessage, statusColor } from "../../../helpers/util";
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Checkbox from '@material-ui/core/Checkbox';

function DeliveryListHeader() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'delivery-filter' : undefined;

    const avialbleStatus = [
        { status: 'open', displayText: 'Order Placed' },
        { status: 'delayed', displayText: 'Delayed' },
        { status: 'out', displayText: 'Out for delivery' },
        { status: 'delivered', displayText: 'Delivered' },
        { status: 'cancelled', displayText: 'Cancelled' }
    ];

    return (
        <div className="community-header-item">
            <div className="community-header-name">DELIVERIES</div>
            <div className="no-class">
                <IconButton aria-label="delete" size="small" onClick={handleClick}>
                    <FilterListIcon fontSize="small" />
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
                                    checked={true}
                                    onChange={null}
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


function DeliveryItem({ delivery }) {
    const { buyer: { house, name }, order: { number, products, totalAmount, status: orderStatus }, payment: { status: paymentStatus } } = delivery;
    const itemText = products.length > 1 ? `${products.length} items` : `${products.length} item`;
    return (
        <div className="delivery-item">
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


export default function DeliveryList({ aggregateDelivery }) {
    if (aggregateDelivery.length == 0) {
        return null;
    }
    console.log(aggregateDelivery);
    const selectedCommuntityForDelivery = aggregateDelivery[0];
    return (
        <div className="product-list-style">
            <DeliveryListHeader />
            <div className="delivery-list-body">
                {
                    selectedCommuntityForDelivery.deliveries.map(((_delivery, i) => (
                        <DeliveryItem key={i} delivery={_delivery} />
                    )))
                }
            </div>
        </div>
    )
}