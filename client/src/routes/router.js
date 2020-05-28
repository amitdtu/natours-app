import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "../components/homePage";
import TourDetails from "../components/tourDetails";
import Header from "../components/header";
import Footer from "../components/footer";
import Login from "../components/login";
import Error from "../components/error";
import Account from "../components/account";
import PrivateRoute from "./privateRoute";
import Goto from "../components/goto";
import ForgotPassword from "../components/forgotPassword";
import ResetPassword from "../components/resetPassword";

const history = createBrowserHistory();

export default function AppRouter() {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <PrivateRoute path="/login" exact component={Login} />
        <PrivateRoute path="/me" exact component={Account} />
        <PrivateRoute path="/forgotPassword" exact component={ForgotPassword} />
        <PrivateRoute
          path="/resetPassword/:resetToken"
          exact
          component={ResetPassword}
        />
        <Route path="/:slug" exact component={TourDetails} />
        <Route component={Error} />
      </Switch>
      <Footer />
      <Goto />
    </Router>
  );
}
