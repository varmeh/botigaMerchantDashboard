import React from "react";
import { withRouter } from 'react-router-dom';
import { AppRoutes } from "./components/AppRoutes";
import { SideNav } from "./components/common/side-nav/side-nav";
import { Error } from "./components/common/Error/Error";
import { fetchProfile } from "./services/auth-service";
import AppContext from "./contexts/AppContext";

import { fetchProducts } from "./services/product-service";
import { getCoupons } from "./services/profile-service";

import "./App.css";

const SIDE_NAVIGATION_HIDDEN_FOR_ROUTES = ['/', '/verify-otp'];

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isError: false,
      products: [],
      coupons: []
    };
  }

  _clearContext = () => this.setState({
    error: null,
    isError: false,
    products: [],
    coupons: []
  })


  async componentDidMount() {
    try {
      await fetchProfile();
      this.props.history.replace("/store");
    } catch (err) {
      this._setError(true, err);
      this.props.history.replace("/");
    }
  }

  async _fetchProductList() {
    try {
      const { data } = await fetchProducts();
      if (data) {
        this.setState({
          products: data
        });
        return data;
      }
      return [];
    } catch (err) { this._setError(true, err); }
  }

  async _fetchCouponList() {
    try {
      const { data } = await getCoupons();
      if (data) {
        const { coupons = [] } = data;
        this.setState({
          coupons: coupons
        });
        return coupons;
      }
      return [];
    } catch (err) { this._setError(true, err); }
  }

  _setError = (value, err) => this.setState({
    isError: value, error: err ? err : null
  });


  render() {
    const { location: { pathname = '' } } = this.props;
    const { isError, error, products, coupons } = this.state;
    const includeSideBar = !SIDE_NAVIGATION_HIDDEN_FOR_ROUTES.includes(pathname)
    return (
      <AppContext.Provider value={{
        products: products,
        coupons: coupons,
        fetchCouponList: this._fetchCouponList.bind(this),
        fetchProductList: this._fetchProductList.bind(this),
        setError: this._setError,
        clearContext: this._clearContext
      }}>
        <div className="app">
          {includeSideBar && <SideNav />}
          <div className={includeSideBar ? 'main-content-sidebar' : 'main-content-no-sidebar'}>
            <AppRoutes />
          </div>
          {isError && <Error err={error} />}
        </div>
      </AppContext.Provider>
    );
  }
}

export const App = withRouter(MyApp);