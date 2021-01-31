import React from "react";
import { Route, Switch } from "react-router-dom";

import { AddProduct } from "./add-product/add-product";
import { Login } from "./auth/login";
import {VerifyOtp} from "./auth/verify-otp";

export function AppRoutes() {
    return (
        <Switch>
            <Route path="/" exact><Login /></Route>
            <Route path="/verify-otp"><VerifyOtp /></Route>
            <Route path="/add-product"><AddProduct /></Route>
        </Switch>
    );
}