import React from "react";
import Button from '@material-ui/core/Button';
import "./select-all-order.css";

export default function SelectAllOrder() {
    return (
        <div className="select-all-order">
            <div className="action-btns-container">
                <Button
                    className="select-all-btn"
                    onClick={null}
                    disableElevation>
                    Select All
                    </Button>
                <Button
                    className="mark-deliverd-btn"
                    onClick={null}
                    disableElevation>
                    Mark Delivered
                    </Button>

                <Button
                    className="out-for-delivery-btn"
                    variant="contained"
                    color='primary'
                    onClick={null}
                    disableElevation>
                    Out for Delivery
                    </Button>
            </div>
        </div>
    );
}