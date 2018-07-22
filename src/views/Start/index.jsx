import React from "react";
import { createBrowserHistory } from "history";
import {
  Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import LoginPage from "views/LoginPage/LoginPage.jsx";
import Dashboard from "layouts/Dashboard/Dashboard.jsx";
import { auth } from "../../firebase";

const hist = createBrowserHistory();

class Start extends React.Component {
  state = {
    auth: false
  }

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        fakeAuth.authenticate()
      } else {
        fakeAuth.signout()
      }
      this.forceUpdate()
    })
  }

  render() {
    return (
      <Router history={hist}>
        <Switch>
          <PublicRoute path="/login-page" component={LoginPage} />
          <PrivateRoute path="/" component={Dashboard} />
        </Switch>
      </Router>
    )
  }
};

const fakeAuth = {
  isAuthenticated: false,
  authenticate() {
    this.isAuthenticated = true;
  },
  signout() {
    this.isAuthenticated = false;
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/login-page",
              state: { from: props.location }
            }}
          />
        )
    }
  />
);
const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
    }
  />
);

export default Start;