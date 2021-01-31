import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/plain.css';


export const Login = withRouter(({ history }) => {
    const [phone, setPhone] = useState('');

    function goToOtpPage() {
        history.push("/verify-otp", { phone });
    }

    return (
        <React.Fragment>
            <PhoneInput
                country={'in'}
                value={phone}
                onChange={val => setPhone(val)}
                onlyCountries={['in']}/>
            <button onClick={goToOtpPage}>Continue</button>
        </React.Fragment>

    );
});