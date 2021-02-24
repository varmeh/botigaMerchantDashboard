import React from "react";
import { withRouter } from 'react-router-dom';
import { AppRoutes } from "./components/AppRoutes";
import { SideNav } from "./components/side-nav/side-nav";
import { Error } from "./components/Error/Error";
import { fetchProfile } from "./services/auth-service";
import AppContext from "./contexts/AppContext";

import { fetchProducts } from "./services/product-service";

import "./App.css";

const SIDE_NAVIGATION_HIDDEN_FOR_ROUTES = ['/', '/verify-otp'];

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isError: false,
      products: [],
    }
  }

  async componentDidMount() {
    try {
      await fetchProfile();
      this.props.history.replace("/store");
    } catch (err) {
      this.setError(true, err);
      this.props.history.replace("/");
    }
  }

  async fetchProductList() {
    try {
      const { data } = await fetchProducts();
      if (data) {
        this.setState({
          products: data
        });
        return data;
      }
    } catch (err) { this.setError(true, err); }
  }

  setError = (value, err) => this.setState({
    isError: value, error: err ? err : null
  });


  render() {
    const { location: { pathname = '' } } = this.props;
    const { isError, error } = this.state;
    const includeSideBar = !SIDE_NAVIGATION_HIDDEN_FOR_ROUTES.includes(pathname)
    return (
      <AppContext.Provider value={{
        products: this.state.products,
        fetchProductList: this.fetchProductList.bind(this),
        setError: this.setError
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