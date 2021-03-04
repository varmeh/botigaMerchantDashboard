import React from "react";
import { Route, Switch } from "react-router-dom";

import { Login } from "./auth/login";
import { VerifyOtp } from "./auth/verify-otp";
import { StoreScreen } from "../pages/store-screen/store-screen";
import { PromoScreen } from "../pages/promo-screen/promo-screen";

import { LOGIN_VIEW, VERIFY_OTP_VIEW, STORE_VIEW, PROMO_VIEW } from "../helpers/BotigaRouteFile";

export function AppRoutes() {
    return (
        <Switch>
            <Route path={LOGIN_VIEW} exact><Login /></Route>
            <Route path={VERIFY_OTP_VIEW} exact><VerifyOtp /></Route>
            <Route path={STORE_VIEW} exact><StoreScreen /></Route>
            <Route path={PROMO_VIEW} exact><PromoScreen /></Route>
        </Switch>
    );
}