import React from "react";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';

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