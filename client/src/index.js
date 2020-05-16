import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { getToken } from "./utils";
import "gestalt/dist/gestalt.css";

import App from "./components/App";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navbar";
import Phones from "./components/Phones";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      getToken() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
const Root = () => (
  <Router>
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <PrivateRoute path="/checkout" component={Checkout} />
        <Route path="/:brandId" component={Phones} />
      </Switch>
    </React.Fragment>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
