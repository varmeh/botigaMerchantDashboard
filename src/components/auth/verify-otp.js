import React, { useState, useEffect } from "react";
import OtpInput from 'react-otp-input';
import { withRouter } from "react-router-dom";
import { getOTP } from "../../services/auth-service";

export const VerifyOtp = withRouter(({ history, location }) => {
    const { state: { phone } } = location;
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        getOTP(phone).then(res => {
            setSessionId(res.data['sessionId']);
        }).catch(err => { })
    }, []);

    function verifyEnterdOTP() {
        if (otp === sessionId) { goToHomePage(); }
        else { alert("Otp missmatch"); }
    }

    function goToHomePage() {
        history.replace("/add-product");
    }

    return (
        <React.Fragment>
            <OtpInput
                value={otp}
                onChange={val => setOtp(val)}
                numInputs={6}
                separator={<span>-</span>} />
            <button onClick={verifyEnterdOTP}>Verify Otp</button>
        </React.Fragment>
    );
})