import React from "react";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((_) => ({
    input: {
        '& label.Mui-focused': {
            fontFamily: 'Montserrat',
            fontSize: '16px',
            fontWeight: '400',
            color: '#179F57',
        },
        '& .MuiInput-underline:after': {
            fontFamily: 'Montserrat',
            fontSize: '16px',
            fontWeight: '400',
            borderBottomColor: '#179F57',
        },
        '& .MuiOutlinedInput-root': {
            fontFamily: 'Montserrat',
            fontSize: '16px',
            fontWeight: '400',
            '&.Mui-focused fieldset': {
                borderColor: '#179F57',
            },
        },
        '& label.Mui-error': {
            fontFamily: 'Montserrat',
            fontSize: '16px',
            fontWeight: '400',
        }
    }
}));

export default function BotigaTextField(props) {
    const classes = useStyles();
    const { className = '', maxLength, requiresCounterValidation, ...otherProps } = props;

    function getHelperText() {
        const { value = '', helperText = '', maxLength = 0, requiresCounterValidation = false } = props;
        if (requiresCounterValidation) {
            if (value.length < maxLength) { return `(${value.length}/${maxLength})`; }
            return helperText;
        }
        return helperText;
    }

    function handleTextFieldChange(event) {
        const { onChange, maxLength = 0, requiresCounterValidation = false } = props;
        if (requiresCounterValidation) {
            if (event.target.value.length > maxLength) { return null; }
            else { onChange(event); }
        } else {
            onChange(event);
        }
    }

    const classNameToApply = [classes.input, className].join(' ');

    const finalPropsToPass = {
        className: classNameToApply,
        ...otherProps,
        helperText: getHelperText(),
        onChange: handleTextFieldChange
    };

    return (
        <TextField {...finalPropsToPass} />
    );
}


