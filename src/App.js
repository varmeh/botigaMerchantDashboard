import React, { useEffect } from "react";
import { AppRoutes } from "./components/AppRoutes";
import { SideNav } from "./components/side-nav/side-nav";
import { withRouter } from "react-router-dom";

import { fetchProfile } from "./services/auth-service";
import "./App.css";

export const App = withRouter(({ history, location: { pathname = '' } }) => {

  const sideBarForbiddenFor = ['/', '/verify-otp'];

  async function isValidTokenWithProfile() {
    try {
      await fetchProfile();
      history.replace("/store");
    } catch (err) {
      history.replace("/");
    }
  }

  useEffect(() => {
    isValidTokenWithProfile();
  }, [])


  return (
    <div className="app">
      {sideBarForbiddenFor.includes(pathname) ? null : <SideNav />}
      <div className="main-content">
        <AppRoutes />
      </div>
    </div>
  )
});