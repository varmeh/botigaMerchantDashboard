import React from "react";
import { withRouter } from "react-router-dom";
import { Formik } from 'formik';
import TextField from "../common/BotigatextField/botiga-textfield";
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Phone from '@material-ui/icons/Phone';
import { loginPhone } from "../../helpers/validators";
import botigaMainLogo from "../../assets/icons/botiga-main-logo.svg";
import { VERIFY_OTP_VIEW } from "../../helpers/BotigaRouteFile";

import "./index.css";

export const Login = withRouter(({ history }) => {

    function goToOtpPage(phone) {
        history.push(VERIFY_OTP_VIEW, { phone });
    }

    return (
        <div className="login">
            <div className="main-logo-conatiner">
                <img className="main-logo" alt="botiga-logo" src={botigaMainLogo} />
            </div>
            <Formik
                enableReinitialize
                validationSchema={loginPhone}
                initialValues={{ 'phone': '' }}
                onSubmit={function (values) {
                    goToOtpPage(values.phone);
                }}>
                {({ handleSubmit, getFieldProps, touched, errors }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="loginForm">
                            <TextField
                                id="phone"
                                placeholder="Phone number"
                                variant="outlined"
                                fullWidth
                                {...getFieldProps('phone')}
                                error={touched.phone && errors.phone}
                                helperText={errors.phone}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone />
                                        </InputAdornment>
                                    ),
                                }} />
                            <Button type="submit" variant="contained" color="primary" size="large" fullWidth disableElevation>Sign In</Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
});