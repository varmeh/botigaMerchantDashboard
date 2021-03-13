import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { BotigaCalendarWithButton } from "../../common/BotigaCalendar/BotigaCalendar";

import "./search-bar.css";

const useStyles = makeStyles((_) => ({
    input: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            },
            width: '335px',
            height: '44px',
            background: '#FFFFFF',
            borderRadius: '4px',
            fontFamily: 'Montserrat'
        },
        '& .MuiInputAdornment-positionStart': {
            marginRight: '0px'
        }
    }
}));

export default function SearchBar({ screenName, reset, handleChange, searchValue, placeHolder = '' }) {
    const classes = useStyles();
    return (
        <div className="search-bar">
            <div className="screen-title">{screenName}</div>
            <TextField
                value={searchValue}
                onChange={handleChange}
                id="search"
                placeholder={placeHolder}
                variant="outlined"
                className={classes.input}
                InputProps={{
                    endAdornment: searchValue ? (
                        <InputAdornment position="start">
                            <IconButton aria-label="delete" size="small" onClick={reset}>
                                <Close />
                            </IconButton>
                        </InputAdornment>
                    ) : (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }} />
        </div>
    );
}



export function SearchBarDelivery({
    screenName,
    reset,
    handleChange,
    searchValue,
    placeHolder = '',
    onDateChange,
    selectedDeliverydate
}) {
    const classes = useStyles();
    return (
        <div className="search-bar">
            <div className="screen-title-conatiner">
                <div className="screen-title">{screenName}</div>
                <div className="spacer" />
                <BotigaCalendarWithButton
                    disableToolbar
                    currentSelectedDate={selectedDeliverydate}
                    onDateChange={onDateChange}
                    btnClassName="delivery-date-selection-btn"
                    id="delivery-date"
                    variant="inline" />
            </div>
            <div className="screen-search-container">
                <Button startIcon={<ArrowDownward />}>Download Excel</Button>
                <div className="spacer" />
                <TextField
                    value={searchValue}
                    onChange={handleChange}
                    id="search"
                    placeholder={placeHolder}
                    variant="outlined"
                    className={classes.input}
                    InputProps={{
                        endAdornment: searchValue ? (
                            <InputAdornment position="start">
                                <IconButton aria-label="delete" size="small" onClick={reset}>
                                    <Close />
                                </IconButton>
                            </InputAdornment>
                        ) : (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }} />
            </div>
        </div>
    );
}
