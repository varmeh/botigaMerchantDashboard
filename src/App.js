import React from "react";
import { AppRoutes } from "./components/AppRoutes";
import { SideNav } from "./components/side-nav/side-nav";

import "./App.css";

export function App() {
  return (
    <div className="app">
      <SideNav />
      <div className="main-content">
        <AppRoutes />
      </div>
    </div>
  )
}
