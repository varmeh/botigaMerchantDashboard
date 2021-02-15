import React from "react";
import { NavLink } from 'react-router-dom';

import botigaLogo from "../../assets/icons/botiga_logo.svg";
import storeIcon from "../../assets/icons/store.svg";
import promoIcon from "../../assets/icons/promo.svg";
import logoutIcon from "../../assets/icons/logout.svg";

import "./side-nav.css";

export function SideNav() {

    function handleLogout() {
        console.log("Logout clicked +++");
    }

    return (
        <div className="sidenav">
            <img className="botiga_logo" src={botigaLogo} />
            <MenuIconItem image={storeIcon} text={"Store"} to="/store" />
            <MenuIconItem image={promoIcon} text={"Promos"} to="/promos" />
            <MenuIconItem image={logoutIcon} text={"Logout"} isLogout handleLogout={handleLogout} />
        </div>
    );
}


function MenuIconItem({ image, text, to, isLogout = false, handleLogout }) {
    if (isLogout) {
        return (
            <div className="menu-icon-items logout_menu_item" onClick={handleLogout}>
                <img className="image-icon" src={image} />
                <span className="text-icon">{text}</span>
            </div>
        )
    }
    return (
        <NavLink to={to} className="menu-icon-items">
            <img className="image-icon" src={image} />
            <span className="text-icon">{text}</span>
        </NavLink>
    )
}