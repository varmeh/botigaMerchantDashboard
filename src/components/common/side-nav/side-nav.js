import React, { useContext } from "react";
import { NavLink, withRouter } from 'react-router-dom';

import botigaLogo from "../../../assets/icons/botiga_logo.svg";
import storeIcon from "../../../assets/icons/store.svg";
import promoIcon from "../../../assets/icons/promo.svg";
import deliveryIcon from "../../../assets/icons/delivery.svg";
import logoutIcon from "../../../assets/icons/logout.svg";

import { Logout } from "../../../services/auth-service";
import { Token } from "../../../helpers/Token";
import AppContext from "../../../contexts/AppContext";
import { LOGIN_VIEW, STORE_VIEW, PROMO_VIEW, DELIVERY_VIEW } from "../../../helpers/BotigaRouteFile";

import "./side-nav.css";
export const SideNav = withRouter(({ history }) => {
    const { setError, clearContext } = useContext(AppContext);

    async function handleLogout() {
        try {
            const token = new Token();
            await Logout();
            await token.setAuthenticationToken('');
            clearContext();
            history.push(LOGIN_VIEW);
        } catch (err) {
            setError(true, err);
        }
    }

    return (
        <div className="sidenav">
            <img className="botiga_logo" alt="botiga-logo" src={botigaLogo} />
            <MenuIconItem image={storeIcon} text={"Store"} to={STORE_VIEW} />
            <MenuIconItem image={promoIcon} text={"Promos"} to={PROMO_VIEW} />
            <MenuIconItem image={deliveryIcon} text={"Delivery"} to={DELIVERY_VIEW} />
            <MenuIconItem image={logoutIcon} text={"Logout"} isLogout handleLogout={handleLogout} />
        </div>
    );
});


function MenuIconItem({ image, text, to, isLogout = false, handleLogout }) {
    if (isLogout) {
        return (
            <div className="menu-icon-items logout_menu_item" onClick={handleLogout}>
                <img className="image-icon" alt={text} src={image} />
                <span className="text-icon">{text}</span>
            </div>
        )
    }
    return (
        <NavLink to={to} className="menu-icon-items">
            <img className="image-icon" alt={text} src={image} />
            <span className="text-icon">{text}</span>
        </NavLink>
    )
}