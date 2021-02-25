import React from "react";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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

export default function BotigaTextField(props) {
    const classes = useStyles();
    return (
        <TextField className={classes.input} {...props} />
    );
}


