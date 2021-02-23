import React, { useState, useEffect } from "react";
import OtpInput from 'react-otp-input';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';

import { getOTP, verifyOtpValue } from "../../services/auth-service";
import botigaMainLogo from "../../assets/icons/botiga-main-logo.svg";
import { Token } from "../../helpers/Token";
import "./index.css";

export const VerifyOtp = withRouter(({ history, location }) => {
    const { state: { phone } } = location;
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(-1);
    let timerId;

    useEffect(() => {
        getOtp();
        return () => clearInterval(timerId);
    }, []);

    function tick() {
        setTimeRemaining(t => {
            if (t == 1) {
                clearInterval(timerId);
                return 0;
            }
            return t - 1;
        });
    }

    function getOtp() {
        sendOtp();
        setTimeRemaining(10);
        timerId = setInterval(tick, 1000);
    }

    function sendOtp() {
        getOTP(phone).then(res => {
            setSessionId(res.data['sessionId']);
        }).catch(err => { })
    }

    async function verifyEnterdOTP() {
        try {
            const response = await verifyOtpValue(phone, sessionId, otp);
            if (response.data['message'] === 'createSeller') {
                alert('seller doesnt not exists');
            } else {
                const { headers: { authorization } } = response;
                const token = new Token();
                await token.setAuthenticationToken(authorization);
                goToStore();
            }

        } catch (err) {
            alert(err);
        }
    }

    function goToStore() {
        history.replace("/store");
    }

    const isVerifyOtpBtnEnabled = (otp != '' && otp.length === 6);

    return (
        <div className="verify-otp">
            <div className="main-logo-conatiner">
                <img className="main-logo" src={botigaMainLogo} />
            </div>
            <div className="description">Please enter OTP sent to your phone number {phone}</div>
            <div className="otpForm">
                <OtpInput
                    className="verify-otp-inputs"
                    value={otp}
                    onChange={val => setOtp(val)}
                    numInputs={6}
                    separator={<span className="otp-seprator" />} />
                <div className="resend">
                    {timeRemaining == 0
                        ? <div onClick={getOtp} className="resendbtn">Resend OTP</div>
                        : <div className="resendText">Resend OTP in {timeRemaining}s</div>
                    }
                </div>
                <Button disabled={!isVerifyOtpBtnEnabled} onClick={verifyEnterdOTP} variant="contained" color="primary" size="large" fullWidth disableElevation>Verify OTP</Button>
            </div>
        </div>
    );
})