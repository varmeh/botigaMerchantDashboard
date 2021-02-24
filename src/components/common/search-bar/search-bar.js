import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

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

export default function SearchBar({ screenName, reset, handleChange, searchValue }) {
    const classes = useStyles();
    return (
        <div className="search-bar">
            <div className="screen-title">{screenName}</div>
            <TextField
                value={searchValue}
                onChange={handleChange}
                id="search"
                placeholder="Search an item or category..."
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
