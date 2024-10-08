import React, { useState } from "react";
import PhoneIcon from "@material-ui/icons/Phone";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import HistoryIcon from "@material-ui/icons/History";
import paymentSucess from "../../../assets/icons/payment-success.svg";
import paymentFailure from "../../../assets/icons/payment-failure.svg";
import {
  isOpen,
  isDelayed,
  isOutForDelivery,
  isRefundDue,
  convertToUiFormatLongDate,
  getMaxDateRangeForDeliveryAction,
} from "../../../helpers/util";
import { BotigaCalendarWithButton } from "../../common/BotigaCalendar/BotigaCalendar";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./order-detail.css";

function OrderDetailsHeader({ selectedOrder, setOrderCancelled }) {
  const [openCancel, setOpenCancel] = useState(false);
  const { order, _id } = selectedOrder;

  function openCancelModal() {
    setOpenCancel(true);
  }

  function closeCancelModal() {
    setOpenCancel(false);
  }

  function cancelOrder() {
    setOpenCancel(false);
  }

  function _setOrderCancelled() {
    setOrderCancelled(_id);
    cancelOrder();
  }

  return (
    <div className="delivery-details-header-item">
      <div className="delivery-details-header-name">ORDER DETAILS</div>
      {(isOpen(order.status) ||
        isDelayed(order.status) ||
        isOutForDelivery(order.status)) && (
        <React.Fragment>
          <Button
            className="delivery-details-header-btn"
            onClick={openCancelModal}
          >
            Cancel order
          </Button>
          <Dialog
            className="delete-category-modal"
            open={openCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Cancel Order</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to cancel this order?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeCancelModal}>{"Don't Cancel"}</Button>
              <Button
                onClick={_setOrderCancelled}
                color="secondary"
                variant="contained"
                disableElevation
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </div>
  );
}

function OrderOverview({ selectedOrder }) {
  const {
    buyer: {
      name,
      house,
      phone,
      apartment: apartmentName,
      area: apartmentArea,
    },
    order: { number, orderDate },
  } = selectedOrder;

  return (
    <div className="delivery-overview">
      <div className="delivery-details-row">
        <div className="buyer-name left-align-item">{name}</div>
        <div className="delivery-info right-align-item">
          <div className="no-class">Order No: #{number}</div>
          <div className="delivery-info-row">
            {convertToUiFormatLongDate(orderDate)}
          </div>
        </div>
      </div>
      <div className="delivery-details-row">
        <div className="delivery-info equal">
          <div className="no-class">
            <div className="no-class">DELIVER TO</div>
            <div className="delivery-info-row delivery-info-black">
              {`${house} ${apartmentName}, ${apartmentArea}`}
            </div>
          </div>
        </div>
        <div className="delivery-query-info-box equal">
          <div className="delivery-info">
            Queries on order or Payment? Contact customer directly.
          </div>
          <Tooltip
            title={<span className="contact-tooltip">{phone}</span>}
            arrow
          >
            <div className="delivery-contact-info">
              <PhoneIcon fontSize="small" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function OrderPaymentSection({ selectedOrder }) {
  const {
    payment: { status, paymentMode = "" },
  } = selectedOrder;

  function renderPaymnetSuccessSection() {
    return (
      <div className="delivery-payment-status">
        <img alt="payment-success" src={paymentSucess} />
        <div className="status-text">Paid via {paymentMode.toUpperCase()}</div>
      </div>
    );
  }

  function renderdPaymentFailureSection() {
    return (
      <div className="delivery-payment-status">
        <img alt="payment-failure" src={paymentFailure} />
        <div className="status-text">Payment Failed</div>
      </div>
    );
  }

  function renderPaymentSection(status) {
    if (status === "success") {
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

function RefundSection({ selectedOrder }) {
  const { refund } = selectedOrder;
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
      if (status === "success") {
        return (
          <React.Fragment>
            <div className="delivery-summary-row-divider" />
            <div className="delivery-details-row">
              <div className="delivery-refund-status">
                <img alt="payment-success" src={paymentSucess} />
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
                <span className="refund-msg">You need to Refund</span>&nbsp;₹
                {amount}
              </div>
              <Button
                className="refund-section-btn"
                variant={"outlined"}
                disableElevation
                startIcon={<HistoryIcon />}
                onClick={openRefundModal}
              >
                Refund
              </Button>
            </div>
            <React.Fragment>
              <Dialog
                className="delete-category-modal"
                open={openRefund}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  How to Refund?
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <ol>
                      <li>
                        Message customer for thier preferred UPI / refund
                        method.
                      </li>
                      <li>
                        Transfer the money to customer as per your convenience
                      </li>
                      <li>
                        Once done. Come back and mark as refund. We will notify
                        the customer :)
                      </li>
                    </ol>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={closeRefundModal}
                    color="primary"
                    variant="contained"
                    disableElevation
                  >
                    Ok
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

function OrderSummary({ selectedOrder }) {
  const { order } = selectedOrder;
  return (
    <React.Fragment>
      <div className="delivery-summary-full-divider" />
      <div className="delivery-details-row">
        <div className="delivery-info left-align-item">
          {order.products.length > 1
            ? `${order.products.length} Items`
            : `${order.products.length} Item`}
        </div>
        <div className="delivery-info-black left-align-item">
          ₹{order.totalAmount}
        </div>
      </div>
      <div className="delivery-summary-row-divider" />
      {order.products.map((_product, index) => (
        <div
          key={index}
          className={
            index % 2 !== 0
              ? "delivery-details-row delivery-summary-shade-row"
              : "delivery-details-row"
          }
        >
          <div className="delivery-info-black left-align-item">{`${_product.quantity} x ${_product.name}`}</div>
          <div className="delivery-info-black left-align-item">
            ₹{_product.quantity * _product.price}
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}

function OrderFeesAndDiscount({ selectedOrder }) {
  const {
    order: { couponCode, discountAmount = 0, deliveryFee = 0, totalAmount = 0 },
  } = selectedOrder;
  const hasCoupon = (couponCode) => couponCode !== "" && couponCode !== null;

  return (
    <React.Fragment>
      <div className="delivery-details-row">
        <div className="delivery-info-black left-align-item">Items total</div>
        <div className="delivery-info-black left-align-item">
          ₹{totalAmount + discountAmount - deliveryFee}
        </div>
      </div>

      <div className="delivery-details-row">
        <div className="delivery-info-black left-align-item">Delivery Fee</div>
        <div className="delivery-info-black left-align-item">
          ₹{deliveryFee}
        </div>
      </div>

      {hasCoupon(couponCode) && (
        <div className="delivery-details-row">
          <div className="delivery-info-black left-align-item">
            Coupon Applied ({couponCode})
          </div>
          <div className="delivery-info-primary left-align-item">
            -₹{discountAmount}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function OrderTotal({ selectedOrder }) {
  const {
    order: { totalAmount },
    payment: { transferredAmount = 0, transferId = "Not Available" },
  } = selectedOrder;
  return (
    <React.Fragment>
      <div className="delivery-summary-row-divider" />
      <div className="delivery-details-row">
        <div className="delivery-info-black delivery-info-bold left-align-item">
          Total Paid
        </div>
        <div className="delivery-info-black delivery-info-bold left-align-item">
          ₹{totalAmount}
        </div>
      </div>
      {transferredAmount !== 0 && (
        <React.Fragment>
          <div className="delivery-summary-row-divider-dashed" />
          <div className="delivery-details-row">
            <div className="delivery-info-black left-align-item">
              Your Settlement
            </div>
            <div className="delivery-info-primary delivery-info-bold left-align-item">
              ₹{transferredAmount}
            </div>
          </div>
          <div className="delivery-summary-row-divider-dashed" />
          <div className="delivery-details-row">
            <div className="delivery-info-black left-align-item">
              Razorpay Reconciliation Id
            </div>
            <div className="delivery-info-black left-align-item">
              {transferId}
            </div>
          </div>
          <div className="delivery-summary-row-divider" />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function RenderFooterBtn({
  selectedOrder,
  setDeliveryStausForOrder,
  setOrderDelayed,
  setOrderRefundComplete,
}) {
  const { order, refund = {}, _id } = selectedOrder;

  function _setDeliveryStausForOrder(status) {
    return function () {
      setDeliveryStausForOrder(_id, status);
    };
  }

  function _setOrderDelayed(date) {
    setOrderDelayed(_id, date);
  }

  function setRefundComplete() {
    setOrderRefundComplete(_id);
  }

  if (isOpen(order.status) || isDelayed(order.status)) {
    return (
      <div className="delivery-details-row-action">
        <BotigaCalendarWithButton
          disableToolbar
          currentSelectedDate={order.expectedDeliveryDate}
          id="delivery-date"
          variant="inline"
          btnClassName="mark-as-delay-btn"
          btnVarient="default"
          btnLabel="Change Delivery Date"
          showBtnIcon={false}
          maxDate={getMaxDateRangeForDeliveryAction(15)}
          onDateChange={_setOrderDelayed}
        />
        <div className="delivery-details-spacer" />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="out-for-delivery-btn"
          onClick={_setDeliveryStausForOrder("out")}
          disableElevation
        >
          Mark Shipped
        </Button>
      </div>
    );
  } else if (isOutForDelivery(order.status)) {
    return (
      <div className="delivery-details-row-action">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mark-as-deiverd-btn"
          onClick={_setDeliveryStausForOrder("delivered")}
          disableElevation
        >
          Mark Delivered
        </Button>
      </div>
    );
  } else if (isRefundDue(refund.status)) {
    return (
      <div className="delivery-details-row-action">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mark-as-refund-btn"
          onClick={setRefundComplete}
          disableElevation
        >
          Mark Refunded
        </Button>
      </div>
    );
  } else {
    return null;
  }
}

export default function OrderDetails({
  selectedOrder,
  setDeliveryStausForOrder,
  setOrderDelayed,
  setOrderCancelled,
  setOrderRefundComplete,
  isProcessingOrder,
}) {
  if (!selectedOrder) {
    return (
      <div className="order-details-style">
        <div className="delivery-details-header-item">
          <div className="delivery-details-header-name">ORDER DETAILS</div>
        </div>
        <div className="delivery-details-body">
          <div className="no-slection">No order selected.</div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={
        isProcessingOrder
          ? "disable-container order-details-style"
          : "order-details-style"
      }
    >
      {isProcessingOrder && (
        <div className="view-loader">
          <CircularProgress />
        </div>
      )}
      <OrderDetailsHeader
        selectedOrder={selectedOrder}
        setOrderCancelled={setOrderCancelled}
      />
      <div className="delivery-details-body">
        <OrderOverview selectedOrder={selectedOrder} />
        <OrderPaymentSection selectedOrder={selectedOrder} />
        <RefundSection selectedOrder={selectedOrder} />
        <OrderSummary selectedOrder={selectedOrder} />
        <OrderFeesAndDiscount selectedOrder={selectedOrder} />
        <OrderTotal selectedOrder={selectedOrder} />
      </div>
      <RenderFooterBtn
        selectedOrder={selectedOrder}
        setDeliveryStausForOrder={setDeliveryStausForOrder}
        setOrderDelayed={setOrderDelayed}
        setOrderRefundComplete={setOrderRefundComplete}
      />
    </div>
  );
}
