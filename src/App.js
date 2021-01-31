import React, { useEffect, useState } from "react";
import { AppRoutes } from "./components/AppRoutes";
import { fetchProfile } from "./services/auth-service";
import { withRouter } from "react-router-dom";

export const App = withRouter(({ history }) => {
  const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   fetchProfile()
  //     .then(() => history.push("/add-product"))
  //     .catch(err => history.push("/"))
  //     .finally(() => setLoading(false))
  // }, []);

  if (isLoading) return (<h1>Loading...</h1>)
  return (
    <AppRoutes />
  );
});