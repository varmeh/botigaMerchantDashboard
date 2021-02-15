import React from "react";
import { Route, Switch } from "react-router-dom";

import { AddProduct } from "./add-product/add-product";
import { Login } from "./auth/login";
import { VerifyOtp } from "./auth/verify-otp";
import { StoreScreen } from "../pages/store-screen/store-screen";
import { PromoScreen } from "../pages/promo-screen/promo-screen";

export function AppRoutes() {
    return (
        <Switch>
            <Route path="/" exact><Login /></Route>
            <Route path="/verify-otp"><VerifyOtp /></Route>
            <Route path="/store" exact><StoreScreen /></Route>
            <Route path="/promos" exact><PromoScreen /></Route>
            <Route path="/add-product"><AddProduct /></Route>
        </Switch>
    );
}