import React, { useEffect, useState } from "react";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    DatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { convertTo_DD_MM_YYY } from "../../../helpers/util";

import "./index.css";

const useStyles = makeStyles((_) => ({
    input: {
        '& label.Mui-focused': {
            color: '#179F57',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#179F57',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#179F57',
            },
        },
    }
}));

export function BotigaCalendar(props) {
    const classes = useStyles();
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker className={`botiga-calendar ${classes.input}`} {...props} />
        </MuiPickersUtilsProvider>
    )
}

export function BotigaCalendarWithButton(props) {
    const { currentSelectedDate, showButtonDatePicker, btnClassName, onDateChange, ...otherProps } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, handleDateChange] = useState(null);

    useEffect(() => {
        handleDateChange(currentSelectedDate);
    }, [currentSelectedDate]);

    function openDatePicker() {
        setIsOpen(true);
    }

    function closeDatePicker() {
        setIsOpen(false);
    }

    function onDateSelect(value) {
        handleDateChange(value);
        closeDatePicker();
        onDateChange(value);
    }

    return (
        <React.Fragment>
            <Button onClick={openDatePicker} className={btnClassName} endIcon={<ExpandMoreIcon />} color="primary">
                {selectedDate != null
                    ? convertTo_DD_MM_YYY(selectedDate) === convertTo_DD_MM_YYY(new Date())
                        ? 'TODAY'
                        : convertTo_DD_MM_YYY(selectedDate)
                    : 'TODAY'}
            </Button>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    open={isOpen}
                    onOpen={openDatePicker}
                    onClose={closeDatePicker}
                    className={`botiga-calendar-withbtn`}
                    value={selectedDate}
                    onChange={onDateSelect}
                    {...otherProps} />
            </MuiPickersUtilsProvider>
        </React.Fragment>
    )
}