import React from "react";
import { withRouter } from 'react-router-dom';
import { AppRoutes } from "./components/AppRoutes";
import { SideNav } from "./components/common/side-nav/side-nav";
import { Error } from "./components/common/Error/Error";
import { fetchProfile } from "./services/auth-service";
import { getBanners } from './services/profile-service';
import AppContext from "./contexts/AppContext";

import { fetchProducts } from "./services/product-service";
import { getCoupons } from "./services/profile-service";
import { fetchApartments } from "./services/apartment-service";
import { NUMBER_OF_BANNERS } from "./helpers/validators";
import { LOGIN_VIEW, HOME_VIEW } from "./helpers/BotigaRouteFile";

import "./App.css";

const SIDE_NAVIGATION_HIDDEN_FOR_ROUTES = ['/', '/verify-otp'];

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isError: false,
      products: [],
      coupons: [],
      banners: [...Array(NUMBER_OF_BANNERS).keys()].map(_ => null),
      apartments: [],
    };
  }

  _clearContext = () => this.setState({
    error: null,
    isError: false,
    products: [],
    coupons: [],
    banners: [...Array(NUMBER_OF_BANNERS).keys()].map(_ => null),
    apartments: []
  })


  async componentDidMount() {
    try {
      await fetchProfile();
      this.props.history.replace(HOME_VIEW);
    } catch (err) {
      this._setError(true, err);
      this.props.history.replace(LOGIN_VIEW);
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

  _fetchBanners = async () => {
    try {
      const { data: { banners = [] } = {} } = await getBanners()
      const bannersList = [...banners, ...this.state.banners].filter(
        (_, index) => index < NUMBER_OF_BANNERS
      )
      this.setState({
        banners: bannersList
      })
    } catch (err) { this._setError(true, err); }
  }

  _updateLocalBannersList = (_bannerList) => this.setState({
    banners: _bannerList
  });

  async _fetchApartments() {
    try {
      const { data: { apartments = [] } = {} } = await fetchApartments();
      this.setState({ apartments: apartments });
      return apartments;
    } catch (err) { this._setError(true, err); }
  }

  _setError = (value, err) => this.setState({
    isError: value, error: err ? err : null
  });


  render() {
    const { location: { pathname = '' } } = this.props;
    const { isError, error, products, coupons, banners, apartments } = this.state;
    const includeSideBar = !SIDE_NAVIGATION_HIDDEN_FOR_ROUTES.includes(pathname)
    return (
      <AppContext.Provider value={{
        products: products,
        coupons: coupons,
        banners: banners,
        apartments: apartments,
        fetchCouponList: this._fetchCouponList.bind(this),
        fetchProductList: this._fetchProductList.bind(this),
        fetchBannerList: this._fetchBanners.bind(this),
        updateLocalBannersList: this._updateLocalBannersList.bind(this),
        fetchApartments: this._fetchApartments.bind(this),
        setError: this._setError,
        clearContext: this._clearContext,
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