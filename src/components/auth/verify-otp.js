import React, { useState, useEffect, useContext } from "react";
import OtpInput from 'react-otp-input';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getOTP, verifyOtpValue } from "../../services/auth-service";
import botigaMainLogo from "../../assets/icons/botiga-main-logo.svg";
import { Token } from "../../helpers/Token";
import appContext from "../../contexts/AppContext";
import { HOME_VIEW } from "../../helpers/BotigaRouteFile";
import "./index.css";

export const VerifyOtp = withRouter(({ history, location }) => {
    const { setError } = useContext(appContext);
    const { state: { phone = '' } = {} } = location;
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    let timerId;

    useEffect(() => {
        getOtp();
        return () => clearInterval(timerId);
    }, []);

    function tick() {
        setTimeRemaining(t => {
            if (t === 1) {
                clearInterval(timerId);
                return 0;
            }
            return t - 1;
        });
    }

    function getOtp() {
        sendOtp();
        setTimeRemaining(30);
        timerId = setInterval(tick, 1000);
    }

    function sendOtp() {
        getOTP(phone).then(res => {
            setSessionId(res.data['sessionId']);
        }).catch(err => {
            setError(true, err);
        })
    }

    async function verifyEnterdOTP() {
        const invalidOtpInput = (otp === '' || otp.length !== 6);
        if (invalidOtpInput) {
            setError(true, "Please enter 6 digits OTP sent to your mobile");
            return;
        }
        try {
            setIsLoading(true);
            const response = await verifyOtpValue(phone, sessionId, otp);
            if (response.data['message'] === 'createSeller') {
                setError(true, "Seller doesn't exists");
            } else {
                const { headers: { authorization } } = response;
                const token = new Token();
                await token.setAuthenticationToken(authorization);
                goToHomeView();
            }
        } catch (err) {
            setError(true, err);
        } finally {
            setIsLoading(false);
        }
    }

    function goToHomeView() {
        history.replace(HOME_VIEW);
    }

    const containerClass = isLoading ? 'verify-otp disable-container' : 'verify-otp';

    return (
        <div className={containerClass}>
            {isLoading && (<div className="view-loader"><CircularProgress /></div>)}
            <div className="main-logo-conatiner">
                <img className="main-logo" alt="botiga-logo" src={botigaMainLogo} />
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
                    {timeRemaining === 0
                        ? <div onClick={getOtp} className="resendbtn">Resend OTP</div>
                        : <div className="resendText">Resend OTP in {timeRemaining}s</div>
                    }
                </div>
                <Button onClick={verifyEnterdOTP} variant="contained" color="primary" size="large" fullWidth disableElevation>Verify OTP</Button>
            </div>
        </div>
    );
})