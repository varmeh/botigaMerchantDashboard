import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import appContext from "../../../contexts/AppContext";

function getErrorMessage(err) {
    if (err) {
        const { response: { data: { message = '' } = {} } = {} } = err;
        return message || 'Some thing wrong happened';
    }
    return 'Some thing wrong happened';
}

export function Error({ err }) {
    const { setError } = useContext(appContext);

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open
            autoHideDuration={6000}
            onClose={handleClose}
            message={getErrorMessage(err)}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    );
}