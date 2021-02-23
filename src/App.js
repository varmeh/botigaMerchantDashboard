import React from "react";
import { withRouter } from 'react-router-dom'
import { AppRoutes } from "./components/AppRoutes";
import { SideNav } from "./components/side-nav/side-nav";
import { fetchProfile } from "./services/auth-service";
import AppContext from "./contexts/AppContext";

import "./App.css";

const SIDE_NAVIGATION_HIDDEN_FOR_ROUTES = ['/', '/verify-otp'];

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false
    }
  }

  async componentDidMount() {
    try {
      await fetchProfile();
      this.props.history.replace("/store");
    } catch (err) {
      this.props.history.replace("/");
    }
  }

  setError = (value) => this.setState({ isError: value });

  render() {
    const { location: { pathname = '' } } = this.props;

    return (
      <AppContext.Provider value={{
        setError: this.setError
      }}>
        <div className="app">
          {SIDE_NAVIGATION_HIDDEN_FOR_ROUTES.includes(pathname) ? null : <SideNav />}
          <div className="main-content">
            <AppRoutes />
          </div>
        </div>
      </AppContext.Provider>
    );
  }
}

export const App = withRouter(MyApp);