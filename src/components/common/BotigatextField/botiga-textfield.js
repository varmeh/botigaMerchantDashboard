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
            '&.Mui-disabled': {
                backgroundColor: '#F7F7F7',
            }
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
    const { className = '', requiresCounterValidation, ...otherProps } = props;

    function getHelperText() {
        if (props.requiresCounterValidation) {
            const {
                value = '',
                inputProps: {
                    maxLength = 0
                } = {}
            } = props;
            return `(${value.length}/${maxLength})`;
        }
        return props.helperText;
    }

    const classNameToApply = [classes.input, className].join(' ');

    const finalPropsToPass = {
        className: classNameToApply,
        ...otherProps,
        helperText: getHelperText(),
    };

    return (
        <TextField {...finalPropsToPass} />
    );
}


