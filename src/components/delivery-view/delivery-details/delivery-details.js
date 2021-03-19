import React, { useState } from "react";
import PhoneIcon from '@material-ui/icons/Phone';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import HistoryIcon from '@material-ui/icons/History';
import paymentSucess from "../../../assets/icons/payment-success.svg";
import paymentFailure from "../../../assets/icons/payment-failure.svg"
import { isOpen, isDelayed, isOutForDelivery, isRefundDue } from "../../../helpers/util";
import { BotigaCalendarWithButton } from "../../common/BotigaCalendar/BotigaCalendar";

import "./delivery-details.css";

function DeliveryDetailsHeader({ selectedDelivery }) {
    const [openCancel, setOpenCancel] = useState(false);
    const { order } = selectedDelivery;


    function openCancelModal() {
        setOpenCancel(true);
    }

    function closeCancelModal() {
        setOpenCancel(false);
    }

    function cancelOrder() {
        setOpenCancel(false);
    }

    return (
        <div className="delivery-details-header-item">
            <div className="delivery-details-header-name">Product details</div>
            {(isOpen(order.status) || isDelayed(order.status)) && (
                <React.Fragment>
                    <Button className="delivery-details-header-btn" onClick={openCancelModal}>Cancel order</Button>
                    <Dialog
                        className="delete-category-modal"
                        open={openCancel}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">Cancel Order</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to cancel this order?
                     </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeCancelModal}>
                                {'Don\'t Cancel'}
                            </Button>
                            <Button onClick={cancelOrder} color="secondary" variant="contained" disableElevation>
                                Confirm
                    </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            )}
        </div>
    );
}

function DeliveryOverview({ selectedDelivery, selectedCommunity }) {
    const {
        buyer: {
            name,
            house,
            phone
        },
        order: {
            number,
        },
        createdAt: orderDate
    } = selectedDelivery;
    const { apartmentName, apartmentArea } = selectedCommunity;
    return (
        <div className="delivery-overview">
            <div className="delivery-details-row">
                <div className="buyer-name left-align-item">{name}</div>
                <div className="delivery-info right-align-item">
                    <div className="no-class">Order No: #{number}</div>
                    <div className="delivery-info-row">
                        {`${new Date(orderDate).toLocaleDateString('en-us', { month: 'short', year: 'numeric', day: 'numeric' })} ${new Date(orderDate).toLocaleTimeString('en-us', {
                            hour12: true, hour: 'numeric',
                            minute: 'numeric'
                        }).toUpperCase()}`}
                    </div>
                </div>
            </div>
            <div className="delivery-details-row">
                <div className="delivery-info">
                    <div className="no-class">DELIVER TO</div>
                    <div className="delivery-info-row delivery-info-black">
                        {`${house} ${apartmentName}, ${apartmentArea}`}
                    </div>
                </div>
                <div className="delivery-query-info-box">
                    <div className="delivery-info">Queries on order or Payment? Contact customer directly.</div>
                    <Tooltip title={<span className="contact-tooltip">{phone}</span>} arrow>
                        <div className="delivery-contact-info">
                            <PhoneIcon fontSize="small" />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

function DeliveryPaymentSection({ selectedDelivery }) {
    const { payment: { status, paymentMode = '' } } = selectedDelivery;

    function renderPaymnetSuccessSection() {
        return (
            <div className="delivery-payment-status">
                <img src={paymentSucess} />
                <div className="status-text">Paid via {paymentMode.toUpperCase()}</div>
            </div>
        );
    }

    function renderdPaymentFailureSection() {
        return (
            <div className="delivery-payment-status">
                <img src={paymentFailure} />
                <div className="status-text">Payment Failed</div>
            </div>
        );
    }

    function renderPaymentSection(status) {
        if (status === 'success') {
            return renderPaymnetSuccessSection();
        } else {
            return renderdPaymentFailureSection();
        }
    }

    return (
        <div className="delivery-details-row delivery-summary-full-divider">
            {renderPaymentSection(status)}
        </div>
    );
}

function RefundSection({ selectedDelivery }) {
    const { refund } = selectedDelivery;
    const [openRefund, setOpenRefund] = useState(false);

    function openRefundModal() {
        setOpenRefund(true);
    }

    function closeRefundModal() {
        setOpenRefund(false);
    }

    if (refund) {
        const { amount, status } = refund;
        if (status) {
            if (status === 'success') {
                return (
                    <React.Fragment>
                        <div className="delivery-summary-row-divider" />
                        <div className="delivery-details-row">
                            <div className="delivery-refund-status">
                                <img src={paymentSucess} />
                                <div className="status-text">Refund Completed.</div>
                            </div>
                        </div>
                    </React.Fragment>

                );
            } else {
                return (
                    <React.Fragment>
                        <div className="delivery-summary-row-divider" />
                        <div className="delivery-details-row">
                            <div className="delivery-refund-status">
                                <span className="refund-msg">You need to Refund</span>&nbsp;₹{amount}
                            </div>
                            <Button disableElevation startIcon={<HistoryIcon />} onClick={openRefundModal}>
                                Refund
                        </Button>
                        </div>
                        <React.Fragment>
                            <Dialog
                                className="delete-category-modal"
                                open={openRefund}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                <DialogTitle id="alert-dialog-title">How to Refund?</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <ol>
                                            <li>Message customer for thier preferred UPI / refund method.</li>
                                            <li>Transfer the money to customer as per your convenience</li>
                                            <li>Once done. Come back and mark as refund. We will notify the customer :)</li>
                                        </ol>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={closeRefundModal} color="primary" variant="contained" disableElevation>
                                        Done
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </React.Fragment>
                );
            }
        }
        return null;
    }
    return null;
}

function DeliverySummary({ selectedDelivery }) {
    const { order } = selectedDelivery;
    return (
        <React.Fragment>
            <div className="delivery-summary-full-divider" />
            <div className="delivery-details-row">
                <div className="delivery-info left-align-item">{order.products.length > 1 ? `${order.products.length} Items` : `${order.products.length} Item`}</div>
                <div className="delivery-info-black left-align-item">₹{order.totalAmount}</div>
            </div>
            <div className="delivery-summary-row-divider" />
            {order.products.map((_product, index) => (
                <div key={index} className={index % 2 !== 0 ? "delivery-details-row delivery-summary-shade-row" : "delivery-details-row"}>
                    <div className="delivery-info-black left-align-item">{`${_product.quantity} x ${_product.name}`}</div>
                    <div className="delivery-info-black left-align-item">₹{_product.quantity * _product.price}</div>
                </div>
            ))}
        </React.Fragment >
    )
}

function DeliveryFeesAndDiscount({ selectedDelivery }) {
    const { order: { couponCode, discountAmount, deliveryFee, totalAmount } } = selectedDelivery;
    const hasCoupon = (couponCode) => couponCode != '' && couponCode != null;

    const hasDeliveryFee = (deliveryFee) =>
        deliveryFee != 0 && deliveryFee != null && deliveryFee.toString() != '';

    if (hasCoupon(couponCode) || hasDeliveryFee(deliveryFee)) {
        return (
            <React.Fragment>
                <div className="delivery-details-row">
                    <div className="delivery-info-black left-align-item">Items total</div>
                    <div className="delivery-info-black left-align-item">₹{totalAmount + discountAmount - deliveryFee}</div>
                </div>
                {hasDeliveryFee(deliveryFee) && (
                    <div className="delivery-details-row">
                        <div className="delivery-info-black left-align-item">Delivery Fee</div>
                        <div className="delivery-info-black left-align-item">₹{deliveryFee}</div>
                    </div>
                )}
                {hasCoupon(couponCode) && (
                    <div className="delivery-details-row">
                        <div className="delivery-info-black left-align-item">Coupon Applied ({couponCode})</div>
                        <div className="delivery-info-primary left-align-item">-₹{discountAmount}</div>
                    </div>
                )}
            </React.Fragment>
        )
    } else {
        return null;
    }
}

function DeliveryTotal({ selectedDelivery }) {
    const { order: { totalAmount } } = selectedDelivery;
    return (
        <React.Fragment>
            <div className="delivery-summary-row-divider" />
            <div className="delivery-details-row">
                <div className="delivery-info-black delivery-info-bold left-align-item">Total Paid</div>
                <div className="delivery-info-black delivery-info-bold left-align-item">₹{totalAmount}</div>
            </div>
        </React.Fragment>
    );
}

function RenderFooterBtn({ selectedDelivery }) {
    const { order, refund = {} } = selectedDelivery;

    if (isOpen(order.status) || isDelayed(order.status)) {
        return (
            <div className='delivery-details-row-action'>
                <BotigaCalendarWithButton
                    disableToolbar
                    currentSelectedDate={null}
                    onDateChange={null}
                    id="delivery-date"
                    variant="inline"
                    btnClassName="no-class"
                    btnVarient="default"
                    btnLabel="Mark as Delay"
                    showBtnIcon={false} />
                <div className='delivery-details-spacer' />
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disableElevation>
                    Out for Delivery
        </Button>
            </div>
        );
    } else if (isOutForDelivery(order.status)) {
        return (
            <div className='delivery-details-row-action'>
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disableElevation>
                    Mark as delivered
                </Button>
            </div>
        );
    } else if (isRefundDue(refund.status)) {
        return (
            <div className='delivery-details-row-action'>
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disableElevation>
                    Mark as Refunded
                </Button>
            </div>
        )
    } else {
        return null;
    }
}

export default function DeliveryDetails({ selectedDelivery, selectedCommunity }) {
    if (!selectedDelivery || !selectedCommunity) {
        return null;
    }
    return (
        <div className="delivery-details-style">
            <DeliveryDetailsHeader selectedDelivery={selectedDelivery} />
            <div className="delivery-details-body">
                <DeliveryOverview selectedDelivery={selectedDelivery} selectedCommunity={selectedCommunity} />
                <DeliveryPaymentSection selectedDelivery={selectedDelivery} />
                <RefundSection selectedDelivery={selectedDelivery} />
                <DeliverySummary selectedDelivery={selectedDelivery} />
                <DeliveryFeesAndDiscount selectedDelivery={selectedDelivery} />
                <DeliveryTotal selectedDelivery={selectedDelivery} />
            </div>
            <RenderFooterBtn selectedDelivery={selectedDelivery} />
        </div>
    )
}