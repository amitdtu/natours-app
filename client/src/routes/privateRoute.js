import React, { useContext } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import AuthContext from "../components/authContext";

function PrivateRoute({ component: Component, ...rest }) {
  const history = useHistory();
  const { isAuthenticated } = useContext(AuthContext);

  // if component is Login then check if already logged in then go to home page otherwise go to login page
  if (
    Component.name === "Login" ||
    Component.name === "ForgotPassword" ||
    Component.name === "ResetPassword"
  ) {
    return (
      <Route
        {...rest}
        render={(props) =>
          !isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    );
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

export default PrivateRoute;
